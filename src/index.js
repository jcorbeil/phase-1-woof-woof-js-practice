document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
  
    let filterOn = false; // Track whether the filter is on or off
  
    // Fetch all pup data from the server
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pups => {
        // Add pup names to the dog bar
        pups.forEach(pup => {
          const span = document.createElement('span');
          span.textContent = pup.name;
          span.addEventListener('click', () => showPupInfo(pup));
          dogBar.appendChild(span);
        });
      });
  
    // Show pup info when a span is clicked
    function showPupInfo(pup) {
      dogInfo.innerHTML = ''; // Clear previous pup info
  
      const img = document.createElement('img');
      img.src = pup.image_url;
  
      const h2 = document.createElement('h2');
      h2.textContent = pup.name;
  
      const button = document.createElement('button');
      button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      button.addEventListener('click', () => toggleGoodDog(pup));
  
      dogInfo.appendChild(img);
      dogInfo.appendChild(h2);
      dogInfo.appendChild(button);
    }
  
    // Toggle the isGoodDog status and update the button text
    function toggleGoodDog(pup) {
      pup.isGoodDog = !pup.isGoodDog;
      const button = dogInfo.querySelector('button');
      button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
  
      // Update the pup's status in the database
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isGoodDog: pup.isGoodDog
        })
      });
    }
  
    // Toggle the filter and update the button text
    filterButton.addEventListener('click', () => {
      filterOn = !filterOn;
      filterButton.textContent = filterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
  
      // Clear the dog bar
      dogBar.innerHTML = '';
  
      // Fetch pup data and filter if necessary
      fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(pups => {
          // Add filtered pup names to the dog bar
          pups.forEach(pup => {
            if (!filterOn || pup.isGoodDog) {
              const span = document.createElement('span');
              span.textContent = pup.name;
              span.addEventListener('click', () => showPupInfo(pup));
              dogBar.appendChild(span);
            }
          });
        });
    });
  });
  