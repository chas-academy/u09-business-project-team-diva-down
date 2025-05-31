import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface SelectOption {
    value: string;
    label: string;
}

interface Categories {
    id: string;
    name: string;
}

interface CategoryDropdownProps {
    selectedOption: SelectOption;
    onOptionChange: (option: SelectOption) => void;
}

const apiCall = 'https://opentdb.com/api_category.php';

const Category_Dropdown: React.FC<CategoryDropdownProps> = ({ selectedOption, onOptionChange }) => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const fetchCategories = async (): Promise<void> => {
        try {
            const response = await axios.get(apiCall);
            const formattedCategories = response.data.trivia_categories.map((category: Categories) => ({
                id: category.id.toString(),
                name: category.name
            }));
            setCategories(formattedCategories);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleDropdown = (e: React.MouseEvent): void => {
        e.stopPropagation();
        if (categories.length === 0) {
            fetchCategories();
        }
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (category: Categories): void => {
        const newOption = {
            value: category.id.toString(),
            label: category.name
        };
        onOptionChange(newOption);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="category_dropdown" ref={selectRef}>
            <div 
                className="select-selected"
                onClick={toggleDropdown}
            >
                {selectedOption.label}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    ▼
                </span>
            </div>
            
            {isOpen && (
                <div className="select-options">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className={`option ${category.id === selectedOption.value ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(category)}
                            >
                                {category.name}
                            </div>
                        ))
                    ) : (
                        <div className="option">Loading categories...</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Category_Dropdown;