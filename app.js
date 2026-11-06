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

// Registrar un nuevo producto
app.post('/productos', async (req, res) => {
    const productos = await redJson('data/productos.json');

    const nuevoProducto = {
        id: productos.length > 0
            ? Math.max(...productos.map(item => item.id)) + 1
            : 1,
        nombre: req.body.nombre,
        precio: req.body.precio,
        fabricante: req.body.fabricante
    };

    productos.push(nuevoProducto);

    await writeJson('data/productos.json', productos);

    res.status(201).json({
        status: 201,
        message: 'Producto registrado correctamente',
        producto: nuevoProducto
    });
});

// Obtener todos los fabricantes
app.get('/fabricantes', async (req, res) => {
    const fabricantes = await redJson('data/fabricantes.json');

    res.status(200).json(fabricantes);
});

const PORT = 3000;



//Borrar
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

// actualizar
app.put('/productos/:id', async (req, res) => {
  const productos = await redJson('data/productos.json');

  const indice = productos.findIndex(
    producto => String(producto.id) === req.params.id
  );

  if (indice === -1) {
    return res.status(404).json({
      status: 404,
      message: 'Registro no encontrado'
    });
  }

  productos[indice] = {
    ...productos[indice],
    ...req.body,
    id: productos[indice].id
  };

  await writeJson('data/productos.json', productos);

  res.status(200).json({
    status: 200,
    message: 'Registro actualizado',
    data: productos[indice]
  });
});







const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});