const { Spell, House } = require('./model');

// ============ SPELL CONTROLLERS ============

// Get all spells with search and filter
exports.getAllSpells = async (req, res) => {
  try {
    const { search, type, sortBy, order } = req.query;
    let query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    let spells = await Spell.find(query);

    // Sort
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      spells.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name) * sortOrder;
        }
        if (sortBy === 'type') {
          return a.type.localeCompare(b.type) * sortOrder;
        }
        if (sortBy === 'createdAt') {
          return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
        }
        return 0;
      });
    }

    res.json({
      success: true,
      data: spells,
      count: spells.length,
      filters: { search: search || null, type: type || null, sortBy: sortBy || null, order: order || 'asc' }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get spell by ID
exports.getSpellById = async (req, res) => {
  try {
    const spell = await Spell.findById(req.params.id);
    if (!spell) return res.status(404).json({ success: false, error: 'Spell not found' });
    res.json({ success: true, data: spell });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create spell
exports.createSpell = async (req, res) => {
  try {
    const { name, type, description } = req.body;
    
    if (!name || !type || !description) {
      return res.status(400).json({ success: false, error: 'All fields (name, type, description) are required' });
    }

    const existingSpell = await Spell.findOne({ name });
    if (existingSpell) {
      return res.status(400).json({ success: false, error: 'Spell already exists' });
    }

    const spell = new Spell({ name, type, description });
    await spell.save();
    res.status(201).json({ success: true, data: spell, message: 'Spell created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update spell
exports.updateSpell = async (req, res) => {
  try {
    const spell = await Spell.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!spell) return res.status(404).json({ success: false, error: 'Spell not found' });
    res.json({ success: true, data: spell, message: 'Spell updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete spell
exports.deleteSpell = async (req, res) => {
  try {
    const spell = await Spell.findByIdAndDelete(req.params.id);
    if (!spell) return res.status(404).json({ success: false, error: 'Spell not found' });
    res.json({ success: true, data: spell, message: 'Spell deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============ HOUSE CONTROLLERS ============

// Get all houses with search and filter
exports.getAllHouses = async (req, res) => {
  try {
    const { search, head, sortBy, order, trait } = req.query;
    let query = {};

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by head of house
    if (head) {
      query.head = { $regex: head, $options: 'i' };
    }

    // Filter by trait
    if (trait) {
      query.traits = { $in: [new RegExp(trait, 'i')] };
    }

    let houses = await House.find(query);

    // Sort
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      houses.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name) * sortOrder;
        }
        if (sortBy === 'head') {
          return a.head.localeCompare(b.head) * sortOrder;
        }
        if (sortBy === 'createdAt') {
          return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
        }
        return 0;
      });
    }

    res.json({
      success: true,
      data: houses,
      count: houses.length,
      filters: { search: search || null, head: head || null, trait: trait || null, sortBy: sortBy || null, order: order || 'asc' }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get house by ID
exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ success: false, error: 'House not found' });
    res.json({ success: true, data: house });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create house
exports.createHouse = async (req, res) => {
  try {
    const { name, colors, symbol, head, traits, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'House name is required' });
    }

    const existingHouse = await House.findOne({ name });
    if (existingHouse) {
      return res.status(400).json({ success: false, error: 'House already exists' });
    }

    const house = new House({
      name,
      colors,
      symbol,
      head,
      traits,
      description
    });
    await house.save();
    res.status(201).json({ success: true, data: house, message: 'House created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update house
exports.updateHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!house) return res.status(404).json({ success: false, error: 'House not found' });
    res.json({ success: true, data: house, message: 'House updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete house
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    if (!house) return res.status(404).json({ success: false, error: 'House not found' });
    res.json({ success: true, data: house, message: 'House deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
