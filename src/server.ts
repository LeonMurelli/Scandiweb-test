import express from 'express';
import { pool } from './mysql';
import cors from 'cors';
import { config } from 'dotenv';

config();
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
})

app.use(cors());

app.post('/add', (request, response) => {
    const {sku, name, price, type, size, weight, height, width, length} = request.body;
    pool.getConnection((err:any, connection:any) => {
        
        connection.query(
            'INSERT INTO products (sku, name, price, type, size, weight, height, width, length) VALUES (?,?,?,?,?,?,?,?,?)',
            [sku, name, price, type, size, weight, height, width, length],
            (error:any, result:any, fields:any) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error)
                }
                response.status(200).json({success: true});
            }
            )
        })
    });
    
app.get('/select', (request, response) => {
    const {sku, name, price, type, size, weight, height, width, length} = request.body;
    pool.getConnection((err:any, connection:any) => {
        
        connection.query(
            'SELECT sku, name, price, type, size, weight, height, width, length FROM products',
            [sku, name, price, type, size, weight, height, width, length],
            (error:any, result:any, fields:any) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error)
                }
                response.status(200).json(result);
            }
            )
        })
    });
        
app.delete('/delete', (request:any, response:any) => {
    const sku = request.query.sku;
    pool.getConnection((err:any, connection:any) => {
        
        connection.query(
            'DELETE FROM products WHERE sku IN (?)',
            [sku],
            (error:any, result:any, fields:any) => {
                connection.release();
                if (error) {
                    return response.status(400).json(error)
                }
                response.status(200).json({success: true});
            }
            )
        })
    });

app.listen(4000);