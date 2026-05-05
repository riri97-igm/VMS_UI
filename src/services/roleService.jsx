import roleApi from '../api/roleApi';

const roleService = {
    // Get all roles
    getAllRoles: async () => {
        try {
            const response = await roleApi.getAll();
            return response.data.data || response.data;
        } catch (error) {
            throw new Error(`Failed to fetch roles: ${error.message}`);
        }
    },

    // Get role by ID
    getRoleById: async (id) => {
        try {
            const response = await roleApi.getById(id);
            return response.data.data || response.data;
        } catch (error) {
            throw new Error(`Failed to fetch role: ${error.message}`);
        }
    },

    // Create new role
    createRole: async (roleData) => {
        try {
            const response = await roleApi.create(roleData);
            return response.data.data || response.data;
        } catch (error) {
            throw new Error(`Failed to create role: ${error.message}`);
        }
    },

    // Update role
    updateRole: async (id, roleData) => {
        try {
            const response = await roleApi.update(id, roleData);
            return response.data.data || response.data;
        } catch (error) {
            throw new Error(`Failed to update role: ${error.message}`);
        }
    },

    // Delete role
    deleteRole: async (id) => {
        try {
            const response = await roleApi.delete(id);
            return response.data.data || response.data;
        } catch (error) {
            throw new Error(`Failed to delete role: ${error.message}`);
        }
    }
};

export default roleService;