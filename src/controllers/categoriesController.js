import connection from '../database/db';
import joi from 'joi';

export async function getCategories(req, res){
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    res.send(categories);
}

export async function postCategories(req, res){
    const newCategory = req.body;

    const categorySchema = joi.object({
        name: joi.string().required()
    })

    const { error } = categorySchema.validate(newCategory);

    console.log(newCategory.name);

    const existent = await connection.query("SELECT * FROM categories WHERE name = $1", [newCategory.name])

    if (error){
        return res.sendStatus(400);
    }else if(existent.rows.length !== 0 ){
        return res.sendStatus(409);
    }

    await connection.query("INSERT INTO categories (name) VALUES ($1)", [newCategory.name]);
    return res.sendStatus(201);

}