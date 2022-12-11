import connection from '../database/db';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRentals (req, res){
    const { rows: rentals } = await connection.query('SELECT * FROM rentals');
    res.send(rentals);
}

export async function postRentals(req, res){
    const newRental = req.body;

    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().required(),
    })

    const { error } = rentalSchema.validate(newRental);

    console.log(newRental);

    const customerExistent = await connection.query("SELECT * FROM customers WHERE id = $1", [newRental.customerId]);
    const gameExistent = await connection.query("SELECT * FROM games WHERE id = $1", [newRental.gameId]);
    const gameRented = await connection.query("SELECT * FROM rentals WHERE id = $1", [newRental.gameId]);


    if (error){
        return res.sendStatus(400);
    }else if (customerExistent.rows.length == 0 || gameExistent.rows.length == 0 || newRental.daysRented <= 0){
        return res.sendStatus(400);
    }else if(gameRented.returnDate){
        if (gameRented.returnDate == null){
            return res.sendStatus(400);
        }
    }

    const rentDate = dayjs().format('YYYY/MM/DD');
    let delayFee = null;
    let returnDate = null;
    const gamePrice = await connection.query("SELECT * FROM games WHERE id = $1", [newRental.gameId]);
    const originalPrice = gamePrice.rows[0].pricePerDay * newRental.daysRented;
    console.log(originalPrice)

    await connection.query(`INSERT INTO rentals ("customerId", "gameId", rentDate, "daysRented", returnDate, originalPrice, "delayFee") VALUES (${newRental.customerId}, ${newRental.gameId}, '${rentDate}', ${newRental.daysRented}, '${returnDate}'), ${originalPrice}, ${delayFee}`);
    return res.sendStatus(201);

}

export async function getRentalsById (req, res){
    const { id } = req.params;
    const { rows: rental } = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
    res.send(rental);
}

export async function postReturn(req, res){
    
    const { id } = req.params;
    const existent = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (existent.rows.length !== 0){
        const day = dayjs().format('YYYY/MM/DD')
        await connection.query('UPDATE rentals SET returnDate = $1 WHERE id = $2', [day, id]);
        return res.sendStatus(200);
    }

}

export async function deleteRental(req, res){
    const { id } = req.params;
    const existent = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (existent.rows.length !== 0 && existent.rows.returnDate !== null){
        await connection.query('DELETE * FROM rentals WHERE id = $1', [id]);
        return res.sendStatus(200);
    }else{
        return res.sendStatus(400);
    }
}