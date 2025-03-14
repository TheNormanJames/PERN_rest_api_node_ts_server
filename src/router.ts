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

router.get('/', getProducts);
router.get(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  getProductById
);
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
router.patch(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  updateAvailabilityProduct
);
router.delete(
  '/:id',
  param('id').isInt().withMessage('Id no es válido'),
  handleInputErrors,
  deleteProduct
);

export default router;
