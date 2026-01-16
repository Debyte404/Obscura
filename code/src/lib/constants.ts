export const COLLEGE_YEARS = ['1st', '2nd', '3rd', '4th'] as const;
export const LANGUAGES = ['Hindi', 'English'] as const;
export const GENDERS = ['Male', 'Female', 'Other'] as const;

// All 36 Indian states and union territories
export const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
] as const;

// Predefined interest tags for matchmaking
// Predefined interest tags categories
export const TAG_CATEGORIES = {
    "Technology & Science": [
        "Artificial Intelligence", "Coding & Dev", "Gadgets & Hardware", "Cybersecurity", "Space & Astronomy",
        "Biotech & Science", "Web3 & Blockchain", "VR & AR", "Data Science", "Robotics"
    ],
    "Business & Finance": [
        "Entrepreneurship", "Investing & Stocks", "Crypto & DeFi", "Marketing & Branding", "Personal Finance",
        "Productivity", "Real Estate", "Leadership", "Economics", "Side Hustles"
    ],
    "Entertainment & Pop Culture": [
        "Movies", "TV Series", "Anime & Manga", "Gaming (Console/PC)", "Esports",
        "Comics & Graphic Novels", "Board Games & TTRPG", "Comedy", "True Crime", "Celebrity News"
    ],
    "Music & Audio": [
        "Pop Music", "Hip Hop & Rap", "Rock & Metal", "EDM & Electronic", "K-Pop",
        "Indie & Alt", "Classical & Jazz", "Music Production", "Podcasts", "Audiobooks"
    ],
    "Lifestyle & Hobbies": [
        "Fashion & Style", "Sneaker Culture", "Beauty & Skincare", "Minimalism", "Photography",
        "Cars & Automotive", "Motorcycles", "DIY & Crafting", "Gardening", "Pets & Animals"
    ],
    "Health & Wellness": [
        "Fitness & Gym", "Yoga & Pilates", "Mental Health", "Nutrition", "Meditation",
        "Running", "Biohacking", "Martial Arts", "Sustainable Living", "Vegan/Vegetarian"
    ],
    "Food & Drink": [
        "Cooking", "Baking", "Fine Dining", "Street Food", "Coffee Culture",
        "Wine & Spirits", "Craft Beer", "Mixology", "Desserts", "Healthy Eating"
    ],
    "Sports & Outdoors": [
        "Football (Soccer)", "Basketball", "American Football", "Cricket", "F1 & Motorsport",
        "Tennis", "Hiking & Camping", "Cycling", "Swimming", "Extreme Sports", "Badminton", "Volleyball", "Table Tennis", "Water Polo", "Hockey", "Pool", "Golf"
    ],
    "Arts, Culture & Thought": [
        "History", "Philosophy", "Psychology", "Literature & Reading", "Writing & Poetry",
        "Art & Design", "Architecture", "Languages", "Politics", "Religion & Spirituality"
    ],
    "Social & Travel": [
        "Travel & Backpacking", "Luxury Travel", "Nightlife & Clubbing", "Social Justice", "Environment",
        "Volunteering", "Parenting", "Relationships & Dating", "Education & Learning", "Memes & Internet Culture"
    ]
} as const;

export const PREDEFINED_TAGS = Object.values(TAG_CATEGORIES).flat();
