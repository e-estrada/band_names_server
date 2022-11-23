
const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Héroes del Silencio'));
bands.addBand(new Band('Metallica'));


//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado...');

    client.emit('active-bands', bands.getBands());
    
    client.on('mensaje', (data) => { 
        console.log(data);
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (data) => {
        bands.voteBand(data.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (data) => {
        const newBand = new Band(data.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (data) => {
        bands.deleteBand(data.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('disconnect', () => { 
        console.log('Cliente desconectado...');   
    });
});