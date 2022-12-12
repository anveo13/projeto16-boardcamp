import connection from '../database/db';
import joi from 'joi';

export async function getCustomers (req, res){
    const cpf = req.query.cpf;
    try {
        if (!cpf) {
            const cpfs = await connection.query('SELECT * FROM customers');
            res.send(cpfs.rows);
        } else {
            const cpfs = await connection.query(
                'SELECT * FROM customers WHERE cpf = $1',
                ['%' + cpf + '%']
            );
            res.send(cpfs.rows);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
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
export async function putCustomersById (req, res){
    const validatingCustomer = req.body;
    delete validatingCustomer.id;
    const id = parseInt(req.params.id);
    try {
        const searchForID = await connection.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );
        if (searchForID.rows.length === 0) {
            res.sendStatus(404);
        } else {
            const customerSchema = joi.object({
                name: joi.string().min(1).required(),
                phone: joi
                    .string()
                    .pattern(/^[0-9]+$/, 'numbers')
                    .min(10)
                    .max(11)
                    .required(),
                cpf: joi
                    .string()
                    .pattern(/^[0-9]+$/, 'numbers')
                    .min(11)
                    .max(11)
                    .required(),
                birthday: joi.date().required(),
            });
            const customer = customerSchema.validate(validatingCustomer);
            if ('error' in customer) {
                res.sendStatus(400);
            } else {
                const { name, phone, cpf, birthday } = validatingCustomer;
                connection.query(
                    'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5',
                    [name, phone, cpf, birthday, id]
                );
                res.sendStatus(201);
            }
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}