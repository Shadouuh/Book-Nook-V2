const path = require('path');
const { router, handleError } = require(path.join(__dirname, '..', 'config', 'setup'));

const createConnection = require(path.join(__dirname, '..', 'config', 'conexBD'));

let conex;
async function init() {
    conex = await createConnection();
}

init();

//Insert into cart
router.post('/insertar', async (req, res) => {
    const { cart } = req.body;

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? ORDER BY id_carrito DESC',
            [cart.id_usuario]
        )

        if (resultCart.length == 0) return handleError(res, 'Error al obtener el id_carrito', null, 404);

        await conex.execute(
            'INSERT INTO carrito_items(id_carrito, id_libro, cantidad) VALUES(?, ?, ?)',
            [resultCart[0].id_carrito, cart.id_libro, cart.cantidad]
        );

        res.status(201).send({ message: 'Se guardo el item en el carrito' });

    } catch (err) {
        return handleError(res, 'Error al guardar en el carrito', err);
    }
});

//Show items
router.get('/items/ver/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultCart] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = 1',
            [id]
        )

        if (resultCart.length == 0) return handleError(res, 'No se encontro el carrito actual', null, 404);

        const [resultItems] = await conex.execute(
            'SELECT id_libro, cantidad FROM carrito_items WHERE id_carrito = ?',
            [resultCart[0].id_carrito]
        );

        if (resultItems.length == 0) return handleError(res, 'No se encontraron o no hay items', null, 404);

        res.status(200).send({ resultItems });

    } catch (err) {
        return handleError(res, 'Hubo un error al mostrar los items del carrito', err);
    }
});

//buy
router.post('/pedir', async (req, res) => {
    const { order } = req.body;

    try {
        const [id_usuario] = await conex.execute(
            'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
            [order.id_usuario]
        );

        if (id_usuario.length == 0) return handleError(res, 'No se encontro al usuario', null, 404);

        const [id_carrito] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = true',
            [order.id_usuario]
        );

        if (id_carrito.length == 0) return handleError(res, 'No se encontro el carrito', null, 404);

        const [pedido] = await conex.execute(
            'INSERT INTO pedidos(total, estado, fecha_estimada, id_usuario, id_carrito) VALUES(?, "pendiente", ?, ?,?)',
            [order.total, order.fecha_estimada, order.id_usuario, id_carrito[0].id_carrito]
        );

        await conex.execute(
            'INSERT INTO transaccion(id_pedido, metodo_pago, num_tarjeta, estado) VALUES(?, ?, ?, "pendiente")',
            [pedido.insertId, order.metodo_pago, order.num_tarjeta]
        )

        await conex.execute(
            'INSERT INTO carrito(id_usuario, es_actual) VALUES(?, true)',
            [order.id_usuario]
        );

        await conex.execute(
            'UPDATE carrito SET es_actual = false WHERE id_carrito = ?',
            [id_carrito[0].id_carrito]
        );

        res.status(201).send({ message: 'Se pidio el carrito' });

    } catch (err) {
        return handleError(res, 'Hubo un error en el carrito', err);
    }
});

//Delete item
router.delete('/borrar/:id_libro/:id_usuario', async (req, res) => {
    const { id_libro, id_usuario } = req.params;
    
    try {
        console.log('Intentando');

        const [id_carrito] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = true',
            [id_usuario]
        );
    
        if (id_carrito.length == 0) return handleError(res, 'No se encontro el carrito', null, 404);

        await conex.execute(
            'DELETE FROM carrito_items WHERE id_libro = ? AND id_carrito = ?',
            [id_libro, id_carrito[0].id_carrito]
        );
        
        res.status(200).send({ message: 'Se elimino el libro con el id' + id_libro });

    } catch (err) {
        return handleError(res, 'Error al intentar eliminar el libro', err);
    }
});

//Update cart
router.put('/actualizar', async (req, res) => {
    const { id_libro, id_usuario, cantidad } = req.body; 

    try {
        const [id_carrito] = await conex.execute(
            'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND es_actual = true',
            [id_usuario]
        );
    
        if (id_carrito.length == 0) return handleError(res, 'No se encontro el carrito', null, 404);

        await conex.execute(
            'UPDATE carrito_items SET cantidad=? WHERE id_libro = ? AND id_carrito = ?',
            [cantidad, id_libro, id_carrito[0].id_carrito]
        );
        
        res.status(200).send({ message: 'Se actualizo la cantidad' + id_libro });

    } catch (err) {
        return handleError(res, 'Error al intentar actualizar la cantidad', err);
    }
});


module.exports = router;
