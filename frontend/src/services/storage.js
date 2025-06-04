const BRANCHES_KEY = 'cdc_branches';
const CURRENT_BRANCH_KEY = 'cdc_current_branch';

export const loadConversation = () => {
    try {
        const branches = JSON.parse(localStorage.getItem(BRANCHES_KEY) || 'null');
        const currentBranchId = localStorage.getItem(CURRENT_BRANCH_KEY) || null;
        return { branches, currentBranchId };
    } catch (e) {
        return { branches: null, currentBranchId: null };
    }
};

export const saveConversation = (branches, currentBranchId) => {
    try {
        localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
        localStorage.setItem(CURRENT_BRANCH_KEY, currentBranchId || '');
    } catch (e) {
        console.error('Failed to save conversation', e);
    }
};

export const clearConversation = () => {
    localStorage.removeItem(BRANCHES_KEY);
    localStorage.removeItem(CURRENT_BRANCH_KEY);
};
