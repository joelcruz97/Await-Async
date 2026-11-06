const express = require('express');
const fs = require('fs/promises');

const app = express();

app.use(express.json());

// Función para leer archivos JSON
async function redJson(ruta) {
    const contenido = await fs.readFile(ruta, 'utf8');
    return JSON.parse(contenido);
}

// Función para escribir archivos JSON
async function writeJson(ruta, datos) {
    await fs.writeFile(ruta, JSON.stringify(datos, null, 2));
}

// Obtener todos los productos
app.get('/productos', async (req, res) => {
    const productos = await redJson('data/productos.json');

    res.status(200).json(productos);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Eliminar un producto por ID
app.delete('/productos/:id', async (req, res) => {
    const productos = await redJson('data/productos.json');

    const restantes = productos.filter(
        item => String(item.id) !== req.params.id
    );

    if (restantes.length === productos.length) {
        return res.status(404).json({
            status: 404,
            message: 'Registro no encontrado'
        });
    }

    await writeJson('data/productos.json', restantes);

    res.status(200).json({
        status: 200,
        message: 'Registro eliminado'
    });
});