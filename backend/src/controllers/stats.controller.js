import { getPrisma } from '../utils/prisma.js';

// Simple in-memory cache
const cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes in milliseconds
};

/**
 * Get aggregated statistics for admin dashboard
 * @route GET /api/admin/stats
 * @access Admin only
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);

    // Check cache first
    const now = Date.now();
    const cacheKey = `stats-${req.tenantId}`;

    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.ttl && cache.data.tenantId === req.tenantId) {
      return res.json({
        success: true,
        data: cache.data.stats
      });
    }

    // Overview Statistics
    const [
      totalVotes,
      totalCandidates,
      activeCandidates,
      totalEvents,
      activeEvents,
      votingOpenEvents,
      todayVotes,
      yesterdayVotes,
      currentEvent
    ] = await Promise.all([
      // Total votes
      prisma.vote.count(),

      // Total candidates
      prisma.candidate.count(),

      // Active candidates
      prisma.candidate.count({
        where: { active: true }
      }),

      // Total events
      prisma.event.count(),

      // Active events
      prisma.event.count({
        where: { active: true }
      }),

      // Events with voting open
      prisma.event.count({
        where: {
          active: true,
          votingOpen: true
        }
      }),

      // Today's votes
      prisma.vote.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),

      // Yesterday's votes
      prisma.vote.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 1)),
            lt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),

      // Current active event
      prisma.event.findFirst({
        where: {
          active: true,
          votingOpen: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          votingOpen: true,
          active: true
        }
      })
    ]);

    // Votes per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const votesLast7Days = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group votes by day
    const votesByDay = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      votesByDay[dateKey] = 0;
    }

    votesLast7Days.forEach(vote => {
      const dateKey = vote.createdAt.toISOString().split('T')[0];
      if (votesByDay[dateKey] !== undefined) {
        votesByDay[dateKey]++;
      }
    });

    const dailyVotes = Object.entries(votesByDay).map(([date, votes]) => ({
      date,
      votes
    }));

    // Top candidates by points (Borda count method)
    // Points: 1st=5, 2nd=4, 3rd=3, 4th=2, 5th=1
    const allVotes = await prisma.vote.findMany({
      select: {
        firstPlace: true,
        secondPlace: true,
        thirdPlace: true,
        fourthPlace: true,
        fifthPlace: true
      }
    });

    const candidatePoints = {};

    allVotes.forEach(vote => {
      // First place: 5 points
      candidatePoints[vote.firstPlace] = (candidatePoints[vote.firstPlace] || 0) + 5;
      // Second place: 4 points
      candidatePoints[vote.secondPlace] = (candidatePoints[vote.secondPlace] || 0) + 4;
      // Third place: 3 points
      candidatePoints[vote.thirdPlace] = (candidatePoints[vote.thirdPlace] || 0) + 3;
      // Fourth place: 2 points
      candidatePoints[vote.fourthPlace] = (candidatePoints[vote.fourthPlace] || 0) + 2;
      // Fifth place: 1 point
      candidatePoints[vote.fifthPlace] = (candidatePoints[vote.fifthPlace] || 0) + 1;
    });

    // Get candidate details for top 3
    const topCandidateIds = Object.entries(candidatePoints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    const topCandidatesData = await prisma.candidate.findMany({
      where: {
        id: { in: topCandidateIds }
      },
      select: {
        id: true,
        name: true,
        municipality: true,
        photoUrl: true
      }
    });

    const topCandidates = topCandidateIds.map((id, index) => {
      const candidate = topCandidatesData.find(c => c.id === id);
      return {
        id,
        name: candidate?.name || 'Unknown',
        municipality: candidate?.municipality || '',
        totalPoints: candidatePoints[id],
        position: index + 1
      };
    });

    // Recent activity (last 10 votes)
    const recentVotes = await prisma.vote.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        voterIp: true,
        voterEmail: true,
        createdAt: true
      }
    });

    const recentActivity = recentVotes.map(vote => ({
      type: 'vote',
      timestamp: vote.createdAt,
      details: 'Nuevo voto registrado'
    }));

    // Calculate voting status
    const votingStatus = votingOpenEvents > 0 ? 'open' : 'closed';

    // Calculate percentage change from yesterday
    let percentageChange = '0%';
    if (yesterdayVotes > 0) {
      const change = ((todayVotes - yesterdayVotes) / yesterdayVotes) * 100;
      percentageChange = `${change > 0 ? '+' : ''}${change.toFixed(0)}%`;
    } else if (todayVotes > 0) {
      percentageChange = '+100%';
    }

    // Compile all stats
    const stats = {
      overview: {
        totalVotes,
        totalCandidates,
        activeCandidates,
        votingStatus,
        currentEvent
      },
      today: {
        votesToday: todayVotes,
        percentageChange
      },
      votesPerDay: dailyVotes,
      topCandidates,
      recentActivity
    };

    // Update cache
    cache.data = {
      tenantId: req.tenantId,
      stats
    };
    cache.timestamp = now;

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed voting statistics
 * @route GET /api/admin/stats/votes
 * @access Admin only
 */
export const getVoteStats = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);

    const totalVotes = await prisma.vote.count();

    // Votes by hour (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentVotes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    // Group by hour
    const votesByHour = {};
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i, 0, 0, 0);
      const hourKey = hour.getHours();
      votesByHour[hourKey] = 0;
    }

    recentVotes.forEach(vote => {
      const hour = vote.createdAt.getHours();
      if (votesByHour[hour] !== undefined) {
        votesByHour[hour]++;
      }
    });

    const hourlyDistribution = Object.entries(votesByHour).map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }));

    res.json({
      success: true,
      data: {
        totalVotes,
        last24Hours: recentVotes.length,
        hourlyDistribution
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get candidate statistics
 * @route GET /api/admin/stats/candidates
 * @access Admin only
 */
export const getCandidateStats = async (req, res, next) => {
  try {
    const prisma = getPrisma(req.tenantId);

    const candidates = await prisma.candidate.findMany({
      select: {
        id: true,
        name: true,
        municipality: true,
        active: true
      }
    });

    const votes = await prisma.vote.findMany({
      select: {
        firstPlace: true,
        secondPlace: true,
        thirdPlace: true,
        fourthPlace: true,
        fifthPlace: true
      }
    });

    const candidateStats = candidates.map(candidate => {
      let firstPlaceVotes = 0;
      let secondPlaceVotes = 0;
      let thirdPlaceVotes = 0;
      let fourthPlaceVotes = 0;
      let fifthPlaceVotes = 0;

      votes.forEach(vote => {
        if (vote.firstPlace === candidate.id) firstPlaceVotes++;
        if (vote.secondPlace === candidate.id) secondPlaceVotes++;
        if (vote.thirdPlace === candidate.id) thirdPlaceVotes++;
        if (vote.fourthPlace === candidate.id) fourthPlaceVotes++;
        if (vote.fifthPlace === candidate.id) fifthPlaceVotes++;
      });

      const totalPoints = (firstPlaceVotes * 5) + (secondPlaceVotes * 4) +
                         (thirdPlaceVotes * 3) + (fourthPlaceVotes * 2) +
                         (fifthPlaceVotes * 1);

      return {
        id: candidate.id,
        name: candidate.name,
        municipality: candidate.municipality,
        active: candidate.active,
        votes: {
          first: firstPlaceVotes,
          second: secondPlaceVotes,
          third: thirdPlaceVotes,
          fourth: fourthPlaceVotes,
          fifth: fifthPlaceVotes,
          total: firstPlaceVotes + secondPlaceVotes + thirdPlaceVotes + fourthPlaceVotes + fifthPlaceVotes
        },
        points: totalPoints
      };
    });

    // Sort by points
    candidateStats.sort((a, b) => b.points - a.points);

    res.json({
      success: true,
      data: candidateStats
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Clear stats cache (for testing or manual refresh)
 * @route POST /api/admin/stats/clear-cache
 * @access Admin only
 */
export const clearStatsCache = async (req, res, next) => {
  try {
    cache.data = null;
    cache.timestamp = null;

    res.json({
      success: true,
      message: 'Cache de estadísticas limpiado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
