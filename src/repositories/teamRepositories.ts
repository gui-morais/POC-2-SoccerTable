import prisma from "../database/db.js";

export async function checkTeamsByName(teamName: string) {
    // return connection.query("SELECT id FROM teams WHERE name ILIKE $1", [teamName]);
    return prisma.teams.findFirst({
        where: {
            name: {
                equals: teamName,
                mode: 'insensitive'
            }
        }
    });
}

export async function createTeam(teamName: string) {
    // await connection.query("INSERT INTO teams (name) VALUES ($1);", [teamName]);
    await prisma.teams.create({
        data: {
            name: teamName
        }
    });
}

export async function eraseTeam(team: number) {
    // connection.query("DELETE FROM teams WHERE id = $1;", [team]);
    await prisma.teams.delete({
        where: {
            id: team
        }
    });
}

export async function table() {
    // return await connection.query(`SELECT 
    // teams.name AS club, 
    // SUM(CASE
    //     WHEN matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS played, 
    // SUM(CASE 
    //     WHEN teams.id = matches.home AND matches.is_finished = true THEN matches.home_goals
    //     WHEN teams.id = matches.away AND matches.is_finished = true THEN matches.away_goals
    //     ELSE 0 END)
    // AS goals_for,
    // SUM(CASE 
    //     WHEN teams.id = matches.home AND matches.is_finished = true THEN matches.away_goals
    //     WHEN teams.id = matches.away AND matches.is_finished = true THEN matches.home_goals
    //     ELSE 0 END)
    // AS goals_against,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals > matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals > matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS wons,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals = matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals = matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS drawns,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals < matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals < matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS losts
    // FROM teams JOIN matches ON teams.id = matches.home OR teams.id = matches.away
    // GROUP BY teams.id ORDER BY teams.id;`);
    const teams = await prisma.teams.findMany({
        select: {
            id: true
        }
    });

    const infos: {
        club: string,
        played: number,
        wons: number,
        drawns: number,
        losts: number,
        goals_for: number,
        goals_against: number
    } [] = [];

    for(let i=0; i<teams.length; i++) {
        await infos.push(await infoTeam(teams[i].id));
    }

    return infos;
}

export async function infoTeam(team: number) {
    // return await connection.query(`SELECT 
    // teams.name AS club, 
    // SUM(CASE
    //     WHEN matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS played, 
    // SUM(CASE 
    //     WHEN teams.id = matches.home AND matches.is_finished = true THEN matches.home_goals
    //     WHEN teams.id = matches.away AND matches.is_finished = true THEN matches.away_goals
    //     ELSE 0 END)
    // AS goals_for,
    // SUM(CASE 
    //     WHEN teams.id = matches.home AND matches.is_finished = true THEN matches.away_goals
    //     WHEN teams.id = matches.away AND matches.is_finished = true THEN matches.home_goals
    //     ELSE 0 END)
    // AS goals_against,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals > matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals > matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS wons,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals = matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals = matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS drawns,
    // SUM(CASE
    //     WHEN (teams.id = matches.home AND matches.home_goals < matches.away_goals) AND matches.is_finished = true THEN 1
    //     WHEN (teams.id = matches.away AND matches.away_goals < matches.home_goals) AND matches.is_finished = true THEN 1
    //     ELSE 0 END)
    // AS losts
    // FROM teams JOIN matches ON teams.id = matches.home OR teams.id = matches.away
    // WHERE teams.name ILIKE $1
    // GROUP BY teams.id;`, [teamName]);
    const name = await prisma.teams.findFirst({
        where: {
            id: team
        },
        select: {
            name: true
        }
    });
    const matches = await prisma.matches.findMany({
        where: {
            OR:[
                {
                    home: team,
                    is_finished: true
                },
                {
                    away: team,
                    is_finished: true
                }
            ]
        }
    });
    const response = {
        club: name.name,
        played: 0,
        wons: 0,
        drawns: 0,
        losts: 0,
        goals_for: 0,
        goals_against: 0
    }
    matches.forEach(e => {
        response.played++;
        if(e.home === team) {
            if(e.home_goals>e.away_goals) {
                response.wons++;
            } else if(e.home_goals===e.away_goals) {
                response.drawns++;
            } else {
                response.losts++;
            }
            response.goals_for += e.home_goals;
            response.goals_against += e.away_goals;
        } else {
            if(e.home_goals<e.away_goals) {
                response.wons++;
            } else if(e.home_goals===e.away_goals) {
                response.drawns++;
            } else {
                response.losts++;
            }
            response.goals_against += e.home_goals;
            response.goals_for += e.away_goals;
        }
    })
    return response;
}