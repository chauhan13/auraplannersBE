const ContentItem = require('../repositories/filesDetailsRepository');

/**
 * Get all content items
 */
exports.getAllContent = async (req, res) => {
  try {
    const items = await ContentItem.findAll();
    
    // Format dates for frontend
    const formattedItems = items.map(item => ({
      ...item,
      date_from: item.date_from.toISOString().split('T')[0],
      date_to: item.date_to.toISOString().split('T')[0]
    }));
    
    res.json(formattedItems);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: 'Failed to fetch content items'
    });
  }
};

/**
 * Get content item by ID
 */
exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentItem.findById(id);

    if (!item) {
      return res.status(404).json({
        error: 'Content item not found'
      });
    }

    // Format dates
    item.date_from = item.date_from.toISOString().split('T')[0];
    item.date_to = item.date_to.toISOString().split('T')[0];

    res.json(item);
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      error: 'Failed to fetch content item'
    });
  }
};

/**
 * Create new content item
 */
exports.createContent = async (req, res) => {
  try {
    const { section, description, date_from, date_to, redirect_link, photo_url } = req.body;

    // Validation
    if (!section || !description || !date_from || !date_to || !photo_url) {
      return res.status(400).json({
        error: 'All required fields must be provided'
      });
    }

    // Create content item
    const item = await ContentItem.create({
      section,
      description,
      date_from,
      date_to,
      redirect_link: redirect_link || '',
      photo_url
    });

    // Format dates
    item.date_from = item.date_from.toISOString().split('T')[0];
    item.date_to = item.date_to.toISOString().split('T')[0];

    res.status(201).json(item);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      error: 'Failed to create content item'
    });
  }
};

/**
 * Update content item
 */
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if content exists
    const existingItem = await ContentItem.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        error: 'Content item not found'
      });
    }

    // Update content
    const updatedItem = await ContentItem.update(id, updateData);

    if (!updatedItem) {
      return res.status(404).json({
        error: 'Content item not found'
      });
    }

    // Format dates
    updatedItem.date_from = updatedItem.date_from.toISOString().split('T')[0];
    updatedItem.date_to = updatedItem.date_to.toISOString().split('T')[0];

    res.json(updatedItem);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      error: 'Failed to update content item'
    });
  }
};

/**
 * Delete content item
 */
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await ContentItem.delete(id);

    if (!deletedItem) {
      return res.status(404).json({
        error: 'Content item not found'
      });
    }

    res.json({
      message: 'Content deleted successfully',
      deleted: deletedItem
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      error: 'Failed to delete content item'
    });
  }
};

/**
 * Get content statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const stats = await ContentItem.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
};