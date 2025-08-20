// Budget Bites Sweden - JavaScript Functions

// Hide loading screen when page loads
window.addEventListener('load', function() {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }, 1500);
});

// Global variables
let selectedIngredients = [];
let currentPortions = 4;
let isImperialMode = false;

// Recipe database for suggestions
const recipeDatabase = {
    'eggs,milk,flour': ['Pannkakor', 'Swedish Pancakes perfect for breakfast or dinner'],
    'bread,cheese,butter': ['Swedish Grilled Cheese', 'Classic comfort food with Swedish twist'],
    'meat,potatoes,onion': ['Budget Köttbullar', 'Swedish meatballs on a budget'],
    'eggs,potatoes': ['Pytt i Panna', 'Swedish hash with leftovers'],
    'milk,flour,butter': ['Pannkakor', 'Traditional Swedish pancakes'],
    'cheese,bread': ['Grilled Cheese', 'Quick and delicious grilled cheese'],
    'potatoes': ['Hasselbackspotatis', 'Swedish sliced baked potatoes'],
    'eggs': ['Pannkakor', 'Swedish pancakes - just add milk and flour'],
    'flour,milk': ['Pannkakor', 'Swedish pancakes - add eggs for best results'],
    'meat': ['Budget Köttbullar', 'Swedish meatballs - add potatoes and onion'],
    'pasta,cheese': ['Pasta Gratäng', 'Swedish pasta bake'],
    'rice,vegetables': ['Vegetarian Pytt i Panna', 'Healthy Swedish hash']
};

// Update ingredients selection
function updateIngredients() {
    selectedIngredients = [];
    const checkboxes = document.querySelectorAll('.ingredient-item input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedIngredients.push(checkbox.value);
    });
    
    // Show/hide the find recipes button based on selection
    const findButton = document.getElementById('findRecipes');
    if (findButton) {
        findButton.style.display = selectedIngredients.length > 0 ? 'block' : 'none';
    }
}

// Find recipes based on selected ingredients
function findRecipes() {
    const suggestionsDiv = document.getElementById('suggestions');
    const suggestionList = document.getElementById('suggestionList');
    
    if (!suggestionsDiv || !suggestionList) return;
    
    // Clear previous suggestions
    suggestionList.innerHTML = '';
    
    // Find matching recipes
    let matches = [];
    const ingredientKey = selectedIngredients.sort().join(',');
    
    // Check for exact matches first
    if (recipeDatabase[ingredientKey]) {
        matches.push({
            name: recipeDatabase[ingredientKey][0],
            description: recipeDatabase[ingredientKey][1],
            match: 'perfect'
        });
    }
    
    // Check for partial matches
    Object.keys(recipeDatabase).forEach(key => {
        const recipeIngredients = key.split(',');
        const hasIngredients = recipeIngredients.filter(ingredient => 
            selectedIngredients.includes(ingredient)
        );
        
        if (hasIngredients.length > 0 && hasIngredients.length >= recipeIngredients.length * 0.6) {
            const recipeName = recipeDatabase[key][0];
            if (!matches.some(match => match.name === recipeName)) {
                matches.push({
                    name: recipeName,
                    description: recipeDatabase[key][1],
                    match: 'good',
                    missing: recipeIngredients.filter(ingredient => 
                        !selectedIngredients.includes(ingredient)
                    )
                });
            }
        }
    });
    
    // Display matches
    if (matches.length > 0) {
        matches.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'suggestion-item';
            matchDiv.innerHTML = `
                <h5>${match.name} ${match.match === 'perfect' ? '✨ Perfect Match!' : '👍 Good Match'}</h5>
                <p>${match.description}</p>
                ${match.missing ? `<p class="missing-ingredients">You'll also need: ${match.missing.join(', ')}</p>` : ''}
                <a href="recipe-${match.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html" class="recipe-link">View Recipe</a>
            `;
            suggestionList.appendChild(matchDiv);
        });
        suggestionsDiv.classList.remove('hidden');
    } else {
        suggestionList.innerHTML = '<p>No exact matches found, but check out our full recipe collection!</p>';
        suggestionsDiv.classList.remove('hidden');
    }
}

// Update recipe with confirmation
function updateRecipe() {
    const unitSystem = document.getElementById('unitSystem');
    const portionsInput = document.getElementById('portions');
    const confirmation = document.getElementById('updateConfirmation');
    
    // Toggle units
    if (unitSystem) {
        isImperialMode = unitSystem.value === 'imperial';
        
        if (isImperialMode) {
            document.body.classList.add('imperial-mode');
        } else {
            document.body.classList.remove('imperial-mode');
        }
    }
    
    // Update portions
    if (portionsInput) {
        const newPortions = parseInt(portionsInput.value);
        if (newPortions >= 1 && newPortions <= 12) {
            const ratio = newPortions / currentPortions;
            currentPortions = newPortions;
            
            // Update all amount spans
            const amounts = document.querySelectorAll('.amount');
            amounts.forEach(amount => {
                const text = amount.textContent;
                // Extract number from text and multiply
                const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
                if (numberMatch) {
                    const originalNumber = parseFloat(numberMatch[1]);
                    const newNumber = (originalNumber * ratio).toFixed(1);
                    amount.textContent = text.replace(numberMatch[1], newNumber);
                }
            });
        }
    }
    
    // Show confirmation
    if (confirmation) {
        confirmation.classList.remove('hidden');
        setTimeout(() => {
            confirmation.classList.add('hidden');
        }, 3000);
    }
}

// Legacy functions for backward compatibility (recipes page)
function toggleUnits() {
    updateRecipe();
}

function updatePortions() {
    updateRecipe();
}

// Recipe form functions
function addIngredient() {
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" name="ingredient[]" placeholder="Ingredient name" required>
        <input type="text" name="amount[]" placeholder="Amount (e.g., 500g, 2 dl)" required>
        <input type="number" name="cost[]" placeholder="Cost (kr)" step="0.1" min="0" required onchange="calculateTotalCost()">
        <select name="store[]" required>
            <option value="">Select store</option>
            <option value="ICA">ICA</option>
            <option value="Coop">Coop</option>
            <option value="Lidl">Lidl</option>
            <option value="Willys">Willys</option>
            <option value="Hemköp">Hemköp</option>
            <option value="City Gross">City Gross</option>
            <option value="Other">Other</option>
        </select>
        <button type="button" class="remove-ingredient" onclick="removeIngredient(this)">❌</button>
    `;
    ingredientsList.appendChild(newRow);
}

function removeIngredient(button) {
    const row = button.closest('.ingredient-row');
    row.remove();
    calculateTotalCost();
}

// Calculate total cost
function calculateTotalCost() {
    const costInputs = document.querySelectorAll('input[name="cost[]"]');
    const servingsInput = document.getElementById('servings');
    let total = 0;
    
    costInputs.forEach(input => {
        if (input.value) {
            total += parseFloat(input.value);
        }
    });
    
    const totalCostSpan = document.getElementById('totalCost');
    const costPerServingSpan = document.getElementById('costPerServing');
    
    if (totalCostSpan) {
        totalCostSpan.textContent = total.toFixed(2) + ' kr';
    }
    
    if (costPerServingSpan && servingsInput) {
        const servings = parseInt(servingsInput.value) || 1;
        const perServing = (total / servings).toFixed(2);
        costPerServingSpan.textContent = perServing + ' kr';
    }
}

// Submit recipe form
function submitRecipe(event) {
    event.preventDefault();
    
    // Basic form validation
    const form = event.target;
    const formData = new FormData(form);
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // In a real application, you would send this data to a server
    console.log('Recipe submitted:', Object.fromEntries(formData));
}

// Initialize page functions
document.addEventListener('DOMContentLoaded', function() {
    // Set up cost calculation for existing inputs
    const costInputs = document.querySelectorAll('input[name="cost[]"]');
    costInputs.forEach(input => {
        input.addEventListener('change', calculateTotalCost);
    });
    
    const servingsInput = document.getElementById('servings');
    if (servingsInput) {
        servingsInput.addEventListener('change', calculateTotalCost);
    }
    
    // Initialize portions tracking
    const portionsInput = document.getElementById('portions');
    if (portionsInput) {
        currentPortions = parseInt(portionsInput.value) || 4;
    }
    
    // Auto-hide find recipes button initially
    const findButton = document.getElementById('findRecipes');
    if (findButton) {
        findButton.style.display = 'none';
    }
});

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAlert(projectName) {
    alert(`${projectName} recipe coming soon! Check back later for more budget-friendly Swedish recipes.`);
}

// Enhanced recipe suggestions with more combinations
const enhancedRecipeDatabase = {
    // Basic combinations
    'eggs': {
        name: 'Äggröra (Swedish Scrambled Eggs)',
        description: 'Creamy Swedish-style scrambled eggs',
        url: 'recipe-aggror.html'
    },
    'bread': {
        name: 'Smörgås Variations',
        description: 'Traditional Swedish open sandwiches',
        url: 'recipes.html'
    },
    'potatoes': {
        name: 'Hasselbackspotatis',
        description: 'Swedish sliced baked potatoes',
        url: 'recipe-hasselback.html'
    },
    
    // Two ingredient combinations
    'eggs,milk': {
        name: 'Pannkakor Base',
        description: 'Swedish pancakes - add flour for complete recipe',
        url: 'recipe-pannkakor.html'
    },
    'bread,butter': {
        name: 'Smörgås med Smör',
        description: 'Classic buttered bread - Swedish style',
        url: 'recipes.html'
    },
    'bread,cheese': {
        name: 'Ostsmörgås',
        description: 'Simple cheese sandwich',
        url: 'recipe-grilled-cheese.html'
    },
    'milk,flour': {
        name: 'Basic Pannkakor',
        description: 'Swedish pancakes - add eggs for best results',
        url: 'recipe-pannkakor.html'
    },
    'eggs,butter': {
        name: 'Äggröra',
        description: 'Creamy scrambled eggs Swedish style',
        url: 'recipes.html'
    },
    'potatoes,butter': {
        name: 'Kokt Potatis',
        description: 'Simple boiled potatoes with butter',
        url: 'recipe-hasselback.html'
    },
    
    // Three ingredient combinations
    'eggs,milk,flour': {
        name: 'Pannkakor',
        description: 'Perfect Swedish pancakes',
        url: 'recipe-pannkakor.html'
    },
    'bread,cheese,butter': {
        name: 'Grilled Cheese Swedish Style',
        description: 'Classic grilled cheese with Swedish cheese',
        url: 'recipe-grilled-cheese.html'
    },
    'potatoes,onion,butter': {
        name: 'Stekt Potatis med Lök',
        description: 'Fried potatoes with onions',
        url: 'recipes.html'
    },
    'eggs,potatoes,onion': {
        name: 'Pytt i Panna',
        description: 'Swedish hash with leftovers',
        url: 'recipe-pytt-panna.html'
    },
    'meat,potatoes,onion': {
        name: 'Köttbullar med Potatis',
        description: 'Swedish meatballs with potatoes',
        url: 'recipe-kottbullar.html'
    },
    'flour,milk,butter': {
        name: 'White Sauce Base',
        description: 'Perfect for gratins and casseroles',
        url: 'recipes.html'
    }
};

// Enhanced recipe finder
function findRecipesEnhanced() {
    const suggestionsDiv = document.getElementById('suggestions');
    const suggestionList = document.getElementById('suggestionList');
    
    if (!suggestionsDiv || !suggestionList) return;
    
    suggestionList.innerHTML = '';
    let matches = [];
    
    // Sort ingredients for consistent key generation
    const sortedIngredients = [...selectedIngredients].sort();
    
    // Check all possible combinations
    for (let i = 1; i <= sortedIngredients.length; i++) {
        // Generate all combinations of i ingredients
        const combinations = getCombinations(sortedIngredients, i);
        combinations.forEach(combo => {
            const key = combo.join(',');
            if (enhancedRecipeDatabase[key]) {
                const recipe = enhancedRecipeDatabase[key];
                if (!matches.some(match => match.name === recipe.name)) {
                    matches.push({
                        ...recipe,
                        ingredients: combo,
                        matchScore: i
                    });
                }
            }
        });
    }
    
    // Sort matches by match score (descending)
    matches.sort((a, b) => b.matchScore - a.matchScore);
    
    // Display matches
    if (matches.length > 0) {
        matches.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'suggestion-item';
            matchDiv.innerHTML = `
                <h5>${match.name} ${match.matchScore === selectedIngredients.length ? '✨ Perfect Match!' : '👍 Good Match'}</h5>
                <p>${match.description}</p>
                <p class="match-info">Uses: ${match.ingredients.join(', ')}</p>
                <a href="${match.url}" class="recipe-link">View Recipe</a>
            `;
            suggestionList.appendChild(matchDiv);
        });
        suggestionsDiv.classList.remove('hidden');
    } else {
        suggestionList.innerHTML = '<p>No matches found with your selected ingredients. Try selecting more ingredients or browse our full recipe collection!</p>';
        suggestionsDiv.classList.remove('hidden');
    }
}

// Helper function to get all combinations
function getCombinations(arr, r) {
    const result = [];
    
    function backtrack(start, current) {
        if (current.length === r) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < arr.length; i++) {
            current.push(arr[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Override the original findRecipes function
function findRecipes() {
    findRecipesEnhanced();
}