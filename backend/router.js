const express = require('express');
const router = express.Router();
const controller = require('./controller');

// ============ SPELL ROUTES ============
router.get('/spells', controller.getAllSpells);
router.post('/spells', controller.createSpell);
router.get('/spells/:id', controller.getSpellById);
router.put('/spells/:id', controller.updateSpell);
router.delete('/spells/:id', controller.deleteSpell);

// ============ HOUSE ROUTES ============
router.get('/houses', controller.getAllHouses);
router.post('/houses', controller.createHouse);
router.get('/houses/:id', controller.getHouseById);
router.put('/houses/:id', controller.updateHouse);
router.delete('/houses/:id', controller.deleteHouse);

module.exports = router;
