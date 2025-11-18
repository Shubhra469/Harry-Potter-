const mongoose = require('mongoose');

const spellSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const houseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  colors: String,
  symbol: String,
  head: String,
  traits: [String],
  description: String
}, { timestamps: true });

const Spell = mongoose.model('Spell', spellSchema);
const House = mongoose.model('House', houseSchema);

module.exports = { Spell, House };
