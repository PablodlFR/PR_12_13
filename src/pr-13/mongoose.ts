import { connect } from 'mongoose'

try {
    connect('mongodb://127.0.0.1:27017/dsi-assessment');
    console.log('Connected to the database');
} catch (error) {
    console.log('Something went wrong when conecting to the database');
}
