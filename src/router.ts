import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailabilityProduct,
  updateProduct,
} from './handlers/product';
import { body, param } from 'express-validator';
import { handleInputErrors } from './middleware';

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   Products:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: The Product ID
 *      example: 1
 *     name:
 *      type: string
 *      description: The Product name
 *      example: MOnitor Curvo de 49
 *     price:
 *      type: number
 *      description: The Product price
 *      example: 300
 *     availability:
 *      type: boolean
 *      description: The Product availability
 *      example: true
 *
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *   summary: Get a list of products
 *   tags:
 *    - Products
 *   description: Return a list of products
 *   responses:
 *    200:
 *     description: Successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Products'
 */

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *   summary: Get a product by ID
 *   tags:
 *     - Products
 *   description: Return a product based on its unique ID
 *   parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: Succesful Response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Products'
 *    404:
 *     description: Not Found
 *    400:
 *     description: Bad Request - Invalid ID
 *
 */
router.get('/', getProducts);
router.get(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *   summary: Creates a new product
 *   tags:
 *    - Products
 *   description: Return a new record in the dtabase
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "Monitor Curvo 49 Pugadas"
 *        price:
 *         type: number
 *         example: 399
 *   responses:
 *    201:
 *     description: Successful response
 *     content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/Products'
 *    400:
 *     description: Bad Request - Invalid Input Data
 *
 */
router.post(
  '/',
  // Validación
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacio'),

  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacio')
    .custom((value) => value > 0)
    .withMessage('Precio no válido'),
  handleInputErrors,

  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *   summary: Updates a products with user input
 *   tags:
 *    - Products
 *   description: Returns the update products
 *   parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      schema:
 *       type: integer
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         example: "Monitor Curvo 49 Pugadas"
 *        price:
 *         type: number
 *         example: 399
 *        availability:
 *         type: boolean
 *         example: true
 *   responses:
 *    200:
 *     description: Successful response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Products'
 *    400:
 *     description: Bad Request - Invalid ID or Input data
 *    404:
 *     description: Product Not Found
 */
router.put(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacio'),

  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacio')
    .custom((value) => value > 0)
    .withMessage('Precio no válido'),
  body('availability')
    .isBoolean()
    .withMessage('Valor para disponibilidad no válido'),
  handleInputErrors,
  updateProduct
);
/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *   summary: Update Products availability
 *   tags:
 *    - Products
 *   description: Return the updated availability
 *   parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: Successful response
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Products'
 *    400:
 *     description: Bad Request
 *    404:
 *     description: Product Not Found
 *
 */
router.patch(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  updateAvailabilityProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *   summary: Deletes a product by a given ID
 *   description: Return a confirmation message
 *   tags:
 *    - Products
 *   parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the products to delete
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: Successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        value: 'Producto Eliminado'
 *    400:
 *     description: Bad Request
 *    404:
 *     description: Product not found
 */
router.delete(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  deleteProduct
);

export default router;
