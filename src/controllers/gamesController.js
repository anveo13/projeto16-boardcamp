import connection from '../database/db';
import joi from 'joi';

export async function getGames (req, res){
    const { rows: games } = await connection.query('SELECT * FROM games');
    res.send(games);
}

export async function postGame(req, res){
    const newGame = req.body;

    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string(),
        stockTotal: joi.number().integer().required(),
        categoryId: joi.number().integer().required(),
        pricePerDay: joi.number().integer().required()
    })

    const { error } = gameSchema.validate(newGame);

    console.log(newGame);

    const existent = await connection.query("SELECT * FROM categories WHERE id = $1", [newGame.categoryId])
    const existent2 = await connection.query("SELECT * FROM games WHERE name = $1", [newGame.name])

    if (error || (newGame.categoryId <= 0 || newGame.pricePerDay <= 0 )){
        return res.sendStatus(400);
    }else if(existent.rows.length == 0 ){
        return res.sendStatus(400);
    }else if (existent2.rows.length !== 0){
        return res.sendStatus(409);
    }

    await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${newGame.name}', '${newGame.image}', ${newGame.stockTotal}, ${newGame.categoryId}, ${newGame.pricePerDay})`);
    return res.sendStatus(201);

}