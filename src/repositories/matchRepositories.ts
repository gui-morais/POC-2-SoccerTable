import prisma from "../database/db.js";

export async function createMatch(home: number, away: number) {
    // connection.query("INSERT INTO matches (home, away) VALUES ($1, $2);", [home, away]);
    await prisma.matches.create({
        data: {
            home,
            away
        }
    });
}

export async function findMatch(home: number, away: number) {
    // return connection.query("SELECT * FROM matches WHERE home = $1 AND away = $2;", [home, away]);
    return prisma.matches.findFirst({
        where: {
            home,
            away
        }
    });
}

export async function updateMatch(match: number, home_goals: number, away_goals: number) {
    // connection.query("UPDATE matches SET home_goals = $2, away_goals = $3, is_finished = $4 WHERE id = $1", [match, home_goals, away_goals, true]);
    await prisma.matches.update({
        where: {id: match},
        data: {
            home_goals,
            away_goals,
            is_finished: true
        }
    });
}

export async function eraseMatch(match: number) {
    // connection.query("DELETE FROM matches WHERE id = $1;", [match]);
    await prisma.matches.delete({
        where: {id: match}
    });
}

export async function deleteMatchesByTeam(team: number) {
    // connection.query("DELETE FROM matches WHERE home = $1 OR away = $1;", [team]);
    await prisma.matches.deleteMany({
        where: {
            OR: [
                {
                    home: team
                },
                {
                    away: team
                }
            ]
        }
    })
}

export async function matchesOfTeam(team: number) {
    // return connection.query(`
    //     SELECT
    //     home.name AS home, 
    //     away.name AS away, 
    //     matches.home_goals, 
    //     matches.away_goals, 
    //     matches.is_finished 
    //     FROM teams AS home JOIN matches 
    //     ON home.id = matches.home 
    //     JOIN teams AS away
    //     ON matches.away = away.id
    //     WHERE (matches.home = $1 OR matches.away = $1);`, [team]);
    const matches = await prisma.matches.findMany({
        where: {
            OR: [
                {
                    home: team
                },
                {
                    away: team
                }
            ]
        },
        include: {
            teams_matches_awayToteams: {
                select: {
                    name: true
                }
            },
            teams_matches_homeToteams: {
                select: {
                    name: true
                }
            },
        },
    });
    const matchesOnCorrectFormat = [];
    matches.forEach(e => matchesOnCorrectFormat.push({
        home: e.teams_matches_homeToteams.name,
        away: e.teams_matches_awayToteams.name,
        home_goals: e.home_goals,
        away_goals: e.away_goals,
        is_finished: e.is_finished
    }));
    return matchesOnCorrectFormat;
}