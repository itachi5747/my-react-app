import React, { useState, createContext, useContext } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Leaf } from 'lucide-react';

// Context for cart management
const CartContext = createContext();

// Sample plant data
const plantsData = {
  succulents: [
    {
      id: 1,
      name: "Jade Plant",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=300&h=300&fit=crop",
      category: "Succulents"
    },
    {
      id: 2,
      name: "Aloe Vera",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1604052057291-7682b36f2fdd?w=300&h=300&fit=crop",
      category: "Succulents"
    }
  ],
  flowering: [
    {
      id: 3,
      name: "Peace Lily",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
      category: "Flowering Plants"
    },
    {
      id: 4,
      name: "African Violet",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop",
      category: "Flowering Plants"
    }
  ],
  foliage: [
    {
      id: 5,
      name: "Monstera Deliciosa",
      price: 32.99,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      category: "Foliage Plants"
    },
    {
      id: 6,
      name: "Fiddle Leaf Fig",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300&h=300&fit=crop",
      category: "Foliage Plants"
    }
  ]
};

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (plant) => {
    setCart(prev => ({
      ...prev,
      [plant.id]: {
        ...plant,
        quantity: (prev[plant.id]?.quantity || 0) + 1
      }
    }));
  };

  const updateQuantity = (plantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(plantId);
    } else {
      setCart(prev => ({
        ...prev,
        [plantId]: {
          ...prev[plantId],
          quantity: newQuantity
        }
      }));
    }
  };

  const removeFromCart = (plantId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[plantId];
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCost = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      getTotalItems,
      getTotalCost
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Header Component
const Header = ({ currentPage, onNavigate }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="bg-green-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Paradise Nursery</h1>
        </div>
        
        <nav className="flex items-center space-x-6">
          {currentPage !== 'landing' && (
            <>
              {currentPage !== 'products' && (
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-green-200 transition-colors"
                >
                  Products
                </button>
              )}
              
              {currentPage !== 'cart' && (
                <button
                  onClick={() => onNavigate('cart')}
                  className="flex items-center space-x-2 hover:text-green-200 transition-colors relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Landing Page Component
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <Header currentPage="landing" onNavigate={onNavigate} />
      
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop")'
        }}
      >
        <div className="text-center text-white p-8 bg-black bg-opacity-40 rounded-lg max-w-2xl mx-4">
          <h1 className="text-5xl font-bold mb-6">Paradise Nursery</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Welcome to Paradise Nursery, where we bring nature's beauty into your home. 
            We specialize in premium houseplants that transform your living space into 
            a green oasis. From easy-care succulents to stunning flowering plants, 
            discover the perfect companions for your indoor garden. Our carefully 
            selected plants are healthy, vibrant, and ready to thrive in your home.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

// Plant Card Component
const PlantCard = ({ plant }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={plant.image}
        alt={plant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{plant.name}</h3>
        <p className="text-2xl font-bold text-green-600 mb-3">${plant.price}</p>
        <button
          onClick={() => addToCart(plant)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Product Category Component
const ProductCategory = ({ title, plants }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

// Products Page Component
const ProductsPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="products" onNavigate={onNavigate} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Plant Collection</h1>
          <p className="text-xl text-gray-600">Discover the perfect plants for your home</p>
        </div>

        <ProductCategory title="Succulents" plants={plantsData.succulents} />
        <ProductCategory title="Flowering Plants" plants={plantsData.flowering} />
        <ProductCategory title="Foliage Plants" plants={plantsData.foliage} />
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">${item.price} each</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="font-semibold text-lg px-3">{item.quantity}</span>
        
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 mt-1 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Cart Page Component
const CartPage = ({ onNavigate }) => {
  const { cart, getTotalItems, getTotalCost } = useCart();
  const cartItems = Object.values(cart);
  const totalItems = getTotalItems();
  const totalCost = getTotalCost();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="cart" onNavigate={onNavigate} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total Cost:</span>
                  <span className="text-green-600">${totalCost.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={() => alert('Checkout functionality would be implemented here!')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigation} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigation} />;
      case 'cart':
        return <CartPage onNavigate={handleNavigation} />;
      default:
        return <LandingPage onNavigate={handleNavigation} />;
    }
  };

  return (
    <CartProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </CartProvider>
  );
};

export default App;