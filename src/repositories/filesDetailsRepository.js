const pool = require('../configuration/connection');
const { v4 : uuidv4 } = require('uuid');

class ContentItem {
  /**
   * Get all content items
   */
  static async findAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM content_items ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching content items: ${error.message}`);
    }
  }

  /**
   * Find content item by ID
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM content_items WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding content item: ${error.message}`);
    }
  }

  /**
   * Find content items by section
   */
  static async findBySection(section) {
    try {
      const result = await pool.query(
        'SELECT * FROM content_items WHERE section = $1 ORDER BY created_at DESC',
        [section]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding content items by section: ${error.message}`);
    }
  }

  /**
   * Find active content items
   */
  static async findActive() {
    try {
      const result = await pool.query(
        'SELECT * FROM content_items WHERE is_active = true ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error finding active content items: ${error.message}`);
    }
  }

  /**
   * Create new content item
   */
  static async create(data) {
    try {
      const { section, description, date_from, date_to, redirect_link, photo_url } = data;
      const id = uuidv4();
      
      const result = await pool.query(
        `INSERT INTO content_items 
         (id, section, description, date_from, date_to, redirect_link, photo_url, is_active, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [id, section, description, date_from, date_to, redirect_link, photo_url, true]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating content item: ${error.message}`);
    }
  }

  /**
   * Update content item
   */
  static async update(id, data) {
    try {
      const { section, description, date_from, date_to, redirect_link, photo_url, is_active } = data;
      
      const result = await pool.query(
        `UPDATE content_items 
         SET section = COALESCE($1, section),
             description = COALESCE($2, description),
             date_from = COALESCE($3, date_from),
             date_to = COALESCE($4, date_to),
             redirect_link = COALESCE($5, redirect_link),
             photo_url = COALESCE($6, photo_url),
             is_active = COALESCE($7, is_active)
         WHERE id = $8
         RETURNING *`,
        [section, description, date_from, date_to, redirect_link, photo_url, is_active, id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error updating content item: ${error.message}`);
    }
  }

  /**
   * Toggle active status
   */
  static async toggleActive(id, isActive) {
    try {
      const result = await pool.query(
        'UPDATE content_items SET is_active = $1 WHERE id = $2 RETURNING *',
        [isActive, id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error toggling content status: ${error.message}`);
    }
  }

  /**
   * Delete content item
   */
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM content_items WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error deleting content item: ${error.message}`);
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_items,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_items,
          COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_items,
          COUNT(DISTINCT section) as total_sections
        FROM content_items
      `);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error getting statistics: ${error.message}`);
    }
  }
}

module.exports = ContentItem;