import prisma from "../src/database/db.js";

async function main() {
    const clubs = [{name: "Man United"}, {name: "Real Madrid"}, {name: "Barcelona"}, {name: "Milan"}];
    const matches: {
        home: number,
        away: number
    }[] = [];

    await prisma.teams.createMany({
        data: clubs
    });

    const teams_id = await prisma.teams.findMany({
        select: {
            id: true
        }
    })
    teams_id.forEach(home => teams_id.forEach(away => {
        matches.push({
            home: home.id,
            away: away.id
        })
    }));
    await prisma.matches.createMany({
        data: matches
    });
}

main()
.then(() => {
    console.log("Registros feitos com sucesso");
})
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});