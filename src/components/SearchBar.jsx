"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Search, X, Clock, TrendingUp } from 'lucide-react'

const SearchBar = memo(({ 
  onSearch, 
  placeholder = "Search for doctors, specialties, conditions...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceRef = useRef()

  // Popular search suggestions
  const popularSearches = [
    "Cardiologist", "Dermatologist", "Pediatrician", "Orthopedic",
    "Neurologist", "Gynecologist", "Psychiatrist", "Dentist"
  ]

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback((term) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (term.length > 1) {
        const filtered = popularSearches.filter(item =>
          item.toLowerCase().includes(term.toLowerCase())
        )
        setSuggestions(filtered.slice(0, 5))
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
  }, [])

  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedGetSuggestions(value)
  }, [debouncedGetSuggestions])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setShowSuggestions(false)

    try {
      // Save to recent searches
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))

      await onSearch(searchTerm.trim())
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, recentSearches, onSearch])

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    onSearch(suggestion)
  }, [onSearch])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }, [])

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
          </div>
          
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(searchTerm.length > 1 || recentSearches.length > 0)}
            placeholder={placeholder}
            className="w-full h-12 pl-12 pr-20 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                     hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md
                     placeholder:text-gray-400"
            aria-label="Search for healthcare services"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            autoComplete="off"
            spellCheck="false"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 
                         transition-colors duration-200 mr-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              aria-label="Search"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl 
                     shadow-xl z-50 max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && searchTerm.length === 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                  <Clock className="w-3 h-3 mr-1" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                             rounded-lg transition-colors duration-150"
                    role="option"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 
                             rounded-lg transition-colors duration-150 flex items-center"
                    role="option"
                  >
                    <Search className="w-3 h-3 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {searchTerm.length > 1 && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No suggestions found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
