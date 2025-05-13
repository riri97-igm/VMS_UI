import staffApi from "../api/staffApi";

const staffService = {
  async getAllStaff() {
    try {
      const response = await staffApi.getAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      return [];
    }
  },

  async createStaff(staff) {
    try {
      const response = await staffApi.create(staff);
      return response.data;
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  },

  async deleteStaff(id) {
    try {
      await staffApi.delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting staff:", error);
      return false;
    }
  },

  async getStaffById(id) {
    try {
      const response = await staffApi.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      throw error;
    }
  },

  async updateStaff(id, staff) {
    try {
      const response = await staffApi.update(id, staff);
      return response.data;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  }
};

export default staffService;