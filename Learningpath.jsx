import React, { useState } from 'react';

const AegiisLearningPaths = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  
  const handleCardClick = (cardId) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };
  
  const paths = [
    {
      id: 'essentials',
      title: 'Cybersecurity Essentials',
      color: '#0099ff',
      icon: '🔒',
      description: 'Master the foundations of cybersecurity defense mechanisms',
      modules: 12,
      content: 'Learn essential cybersecurity concepts including network security fundamentals, encryption basics, authentication methods, and security compliance frameworks. This learning path provides the theoretical groundwork and technical concepts necessary for understanding modern cybersecurity architectures and implementation techniques. Through a series of structured modules, you\'ll develop a comprehensive understanding of security principles that form the basis of all defense strategies.'
    },
    {
      id: 'attacks',
      title: 'Attacks & Vulnerabilities',
      color: '#ff5500',
      icon: '⚠️',
      description: 'Identify and mitigate common security threats',
      modules: 10,
      content: 'Explore various attack vectors including SQL injection, XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), session hijacking, and social engineering techniques. This theoretical path examines the underlying principles of common vulnerabilities, the mathematical and logical foundations of attacks, and the systematic approaches to threat analysis. You\'ll learn formal threat modeling techniques and gain insight into attack surface analysis methodologies used by security researchers.'
    },
    {
      id: 'sdlc',
      title: 'SDLC Cycle',
      color: '#9933cc',
      icon: '🔄',
      description: 'Integrate security throughout the development lifecycle',
      modules: 8,
      content: 'Discover how to incorporate security at every stage of the Software Development Life Cycle. From threat modeling during requirements gathering to code reviews, security testing, and secure deployment practices — this path provides a theoretical framework for secure software engineering principles. You\'ll explore formal verification methods, security requirement specification techniques, and theoretical models for security integration across the entire development process.'
    }
  ];
  
  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="text-orange-500 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M3.98 8.223A10.5 10.5 0 001.5 16.5C1.5 19.58 3.8 22 6.736 22h10.528C20.2 22 22.5 19.58 22.5 16.5c0-2.565-.863-4.923-2.347-6.81l-3.916-5.522a2.25 2.25 0 00-3.658 0L8.666 9.723A2.25 2.25 0 006.987 10.5H5.25a2.25 2.25 0 00-1.27.375zm9.52-3.223l3 4.25h-5.75l1.32-2.629a.75.75 0 011.43 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-orange-500">AEGIIS</span>
        </div>
        <div className="flex space-x-6">
          <span>Home</span>
          <span>Challenges</span>
          <span className="text-orange-500 border-b-2 border-orange-500">Learning Paths</span>
          <span>AI Tools</span>
          <span>Community</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs absolute -top-1 -right-1">1</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <div className="flex items-center bg-orange-500 text-white rounded-full px-1 py-1">
            <span className="text-xs font-bold ml-1 mr-1">US</span>
          </div>
        </div>
      </div>
      
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
        <p className="text-gray-400 mb-4">Explore structured learning paths to master different aspects of cybersecurity through our comprehensive curriculum</p>
        <p className="text-gray-300">The Aegiis learning framework is designed to provide both theoretical knowledge and practical skills in cybersecurity. Each learning path contains curated educational content developed by industry experts and academic researchers. Our pedagogical approach combines foundational security theory with relevant case studies to ensure a deep understanding of cybersecurity principles.</p>
        <p className="text-gray-300 mt-2">Select a learning path below to begin your educational journey and systematically build your knowledge base in specific domains of cybersecurity.</p>
      </div>
      
      {/* Learning Paths */}
      <div className="space-y-4 mt-8">
        {paths.map((path) => (
          <div key={path.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div 
              className="p-4 cursor-pointer transition-colors"
              style={{ borderLeft: `4px solid ${path.color}` }}
              onClick={() => handleCardClick(path.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3" style={{ color: path.color }}>{path.icon}</span>
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: path.color }}>{path.title}</h2>
                    <p className="text-gray-400 text-sm">{path.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm mr-4">{path.modules} Modules</span>
                  <span className="text-xl" style={{ color: path.color }}>
                    {expandedCard === path.id ? '−' : '+'}
                  </span>
                </div>
              </div>
            </div>
            
            {expandedCard === path.id && (
              <div className="px-4 pb-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300 mb-4">{path.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">Theoretical Concepts</span>
                    <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">Academic Research</span>
                    <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">Case Studies</span>
                    <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">Security Principles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md text-sm transition-colors">
                        View Syllabus
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md text-sm transition-colors">
                        Learning Resources
                      </button>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
                      Start Path
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Stats */}
      <div className="mt-8 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Your Learning Progress</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Paths Started</p>
            <p className="text-2xl font-bold">2/3</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Modules Completed</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Current Rank</p>
            <p className="text-2xl font-bold">Hero</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">Next Milestone</p>
            <p className="text-2xl font-bold">Conqueror</p>
          </div>
        </div>
      </div>
      
      {/* Additional Resources */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Supplementary Academic Resources</h2>
        <p className="text-gray-300 mb-4">Enhance your learning experience with these additional educational materials and research papers</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-medium text-blue-400 mb-2">Research Publications</h3>
            <p className="text-gray-400 text-sm">Access academic papers, journals, and publications related to cybersecurity theory and practice</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">Learning Community</h3>
            <p className="text-gray-400 text-sm">Join discussion forums and study groups with other cybersecurity learners and academics</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-medium text-purple-400 mb-2">Expert Lectures</h3>
            <p className="text-gray-400 text-sm">Watch recorded lectures from industry experts and university professors on advanced topics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AegiisLearningPaths;