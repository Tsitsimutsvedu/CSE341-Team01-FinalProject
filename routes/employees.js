const express = require('express');
const router = express.Router();

const employeesController = require('../controllers/employees.controller');
const { authorizeAdminOrEmployee } = require('../middleware/auth');
const { verifyGoogleToken } = require('../middleware/VerifyGoogleToken');
const validationRequests = require('../middleware/validationRequests');
const {
  validateEmployeeId,
  validateEmployeeBody,
} = require('../middleware/employeeValidation');

router.get('/', employeesController.getAllEmployees);

router.post(
  '/',
  validateEmployeeBody,
  validationRequests,
  employeesController.createEmployee
);

router.get(
  '/:id',
  validateEmployeeId,
  validationRequests,
  employeesController.getEmployeeById
);
router.put(
  '/:id',
  validateEmployeeId,
  validationRequests,
  employeesController.updateEmployee
);
router.delete('/:id', employeesController.deleteEmployee);

module.exports = router;
