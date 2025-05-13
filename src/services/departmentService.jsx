import departmentApi from "@/api/departmentApi";

const departmentService = {
  async getAllDepartments() {
    try {
      const response = await departmentApi.getAll();
      return response.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  },

  async createDepartment(department) {
    try {
      const response = await departmentApi.create(department);
      return response.data;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  },

  async deleteDepartment(id, changedBy) {
    try {
      await departmentApi.delete(id, changedBy);
      return true;
    } catch (error) {
      console.error("Error deleting department:", error);
      return false;
    }
  },

  async getDepartmentById(id) {
    try {
      const response = await departmentApi.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching department by ID:", error);
      throw error;
    }
  },

  async updateDepartment(id, department) {
    try {
      const response = await departmentApi.update(id, department);
      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      throw error;
    }
  }
};

export default departmentService;