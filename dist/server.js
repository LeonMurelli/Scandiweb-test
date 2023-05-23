"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = require("./mysql");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});
app.use((0, cors_1.default)());
app.post('/add', (request, response) => {
    const { sku, name, price, type, size, weight, height, width, length } = request.body;
    mysql_1.pool.getConnection((err, connection) => {
        connection.query('INSERT INTO products (sku, name, price, type, size, weight, height, width, length) VALUES (?,?,?,?,?,?,?,?,?)', [sku, name, price, type, size, weight, height, width, length], (error, result, fields) => {
            connection.release();
            if (error) {
                return response.status(400).json(error);
            }
            response.status(200).json({ success: true });
        });
    });
});
app.get('/select', (request, response) => {
    const { sku, name, price, type, size, weight, height, width, length } = request.body;
    mysql_1.pool.getConnection((err, connection) => {
        connection.query('SELECT sku, name, price, type, size, weight, height, width, length FROM products', [sku, name, price, type, size, weight, height, width, length], (error, result, fields) => {
            connection.release();
            if (error) {
                return response.status(400).json(error);
            }
            response.status(200).json(result);
        });
    });
});
app.delete('/delete', (request, response) => {
    const sku = request.query.sku;
    mysql_1.pool.getConnection((err, connection) => {
        connection.query('DELETE FROM products WHERE sku IN (?)', [sku], (error, result, fields) => {
            connection.release();
            if (error) {
                return response.status(400).json(error);
            }
            response.status(200).json({ success: true });
        });
    });
});
app.listen(4000);
