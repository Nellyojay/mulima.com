export function daysAgo(n){
  const d = new Date(); 
  d.setDate(d.getDate()-n);
  return d.toLocaleDateString();
}