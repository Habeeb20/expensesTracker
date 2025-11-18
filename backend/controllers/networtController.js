import NetWorth from "../models/networtModel.js";



export const getNetWorth = async (req, res) => {
     try {
        const items = await NetWorth.find({ userId: req.user.id }).sort({ createdAt: -1 });
        
        const assets = items.filter(i => i.type === 'asset');
        const liabilities = items.filter(i => i.type === 'liability');
        
        res.json({ assets, liabilities });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
}

export const postNetWorth = async (req, res) => {
     const { type, name, amount } = req.body;
    
      // Validation
      if (!type || !name || !amount) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    
      if (!['asset', 'liability'].includes(type)) {
        return res.status(400).json({ message: 'Type must be asset or liability' });
      }
    
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
    
      try {
        const item = await NetWorth.create({
          userId: req.user.id,
          type,
          name: name.trim(),
          amount: +amount
        });
    
        res.status(201).json({ item });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save' });
      }
}

export const edit = async(req, res) => {
     try {
        const item = await NetWorth.findOneAndUpdate(
          { _id: req.params.id, userId: req.user.id },
          req.body,
          { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.json({ item });
      } catch (err) {
        res.status(500).json({ message: 'Update failed' });
      }
}


export const deletenetwort = async(req, res) => {
    
  try {
    const result = await NetWorth.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
}