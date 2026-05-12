

export function hasD7Passed(createdAt: Date | string): boolean {
  const accountCreationDate = new Date(createdAt);
  const now = new Date();
  const diffTime = now.getTime() - accountCreationDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24); 
  return diffDays >= 7;
}

export function canAccessContent(
  userPlan: string,
  userCreatedAt: Date | string,
  contentPlanAccess: string,
  isBonus: boolean,
  d7Rule: boolean
) {
  if (contentPlanAccess === 'ADVANCED' && userPlan === 'BASIC') {
    return false;
  }
  
  if (isBonus && userPlan === 'BASIC') {
    return false;
  }
  
  if (d7Rule && !hasD7Passed(userCreatedAt)) {
    return false;
  }
  
  return true;
}
