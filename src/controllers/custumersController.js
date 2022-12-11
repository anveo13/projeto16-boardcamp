import connection from '../database/db';
import joi from 'joi';

export async function getCustomers (req, res){
    const { rows: customers } = await connection.query('SELECT * FROM customers');
    res.send(customers);
}

export async function postCustomers(req, res){
    const newCostumer = req.body;

    const customerSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().required().min(10),
        cpf: joi.string().required().min(11),
        birthday: joi.date().required()
    })

    const { error } = customerSchema.validate(newCostumer);

    console.log(newCostumer);

    const existent = await connection.query("SELECT * FROM customers WHERE cpf = $1", [newCostumer.cpf])
    
    if (error){
        return res.sendStatus(400);
    }else if (existent.rows.length !== 0){
        return res.sendStatus(409);
    }

    await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${newCostumer.name}', '${newCostumer.phone}', '${newCostumer.cpf}', '${newCostumer.birthday}')`);
    return res.sendStatus(201);

}

export async function getCustomersById (req, res){
    const { id } = req.params;
    const { rows: costumer } = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);
    res.send(costumer)
}