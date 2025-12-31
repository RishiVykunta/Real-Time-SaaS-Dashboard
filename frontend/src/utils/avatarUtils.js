export const getAvatarInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

export const getAvatarColor = (name) => {
  if (!name) return 'bg-gray-400';
  
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export const getAvatarUrl = (name, size = 40) => {
  const initials = getAvatarInitials(name);
  const color = getAvatarColor(name).replace('bg-', '').replace('-500', '');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${color}&color=fff&bold=true`;
};

