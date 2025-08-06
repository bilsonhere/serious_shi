// firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
        import { firebaseConfig } from './firebase-config1.js';

      
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        document.addEventListener('DOMContentLoaded', function() {
          
            const sections = Array.from(document.querySelectorAll('.section'));
            
            // DOM
            const nameInput = document.getElementById('name');
                        const nameSubmitBtn = document.getElementById('name-submit-btn');
            const welcomeContinueBtn = document.getElementById('welcome-continue-btn');
            const submitAllBtn = document.getElementById('submit-all-btn');
            const confirmYesBtn = document.getElementById('confirm-yes');
            const confirmNoBtn = document.getElementById('confirm-no');
            const confirmationDialog = document.getElementById('confirmation-dialog');
            const personalGreeting = document.getElementById('personal-greeting');
            const pigeon = document.getElementById('pigeon');
            const bgAudio = document.getElementById('bg-audio');

            // INDEX
            let currentSectionIndex = 0;
            let userName = '';
            const answers = {};

            // show secn and hide
            function showSection(index) {
                sections.forEach((section, i) => {
                    if (i === index) {
                        section.classList.add('visible');
                        // transition
                        setTimeout(() => {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    } else {
                        section.classList.remove('visible');
                    }
                });
            }

            // name
            nameSubmitBtn.addEventListener('click', () => {
                if (nameInput.value.trim() === '') {
                    alert('Your royal title is required to proceed!');
                    return;
                }
                
                userName = nameInput.value.trim();
                personalGreeting.textContent = `My Dearest ${userName.split(' ')[0]}`;
                
             
                bgAudio.play().catch(e => console.log('Audio play failed:', e));
                
                
                currentSectionIndex = 1;
                showSection(currentSectionIndex);
            });

            // continue
            welcomeContinueBtn.addEventListener('click', () => {
                currentSectionIndex = 2;
                showSection(currentSectionIndex);
            });

            // next button
            document.querySelectorAll('.btn-submit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const currentSection = e.target.closest('.section');
                    const textarea = currentSection.querySelector('textarea');
                    const questionText = currentSection.querySelector('.question-text').textContent;
                    
                    if (textarea.value.trim() === '') {
                        alert('A royal response is required!');
                        return;
                    }
                    
                    // save ans
                    answers[questionText] = textarea.value.trim();
                    
                    // next secn
                    currentSectionIndex++;
                    
                    // submit enable
                    if (currentSectionIndex === sections.length - 2) { 
                        submitAllBtn.disabled = false;
                    }
                    
                    showSection(currentSectionIndex);
                });
            });

            // prev button
            document.querySelectorAll('.btn-back').forEach(button => {
                button.addEventListener('click', () => {
                  
                    if (currentSectionIndex === 2) {
                        currentSectionIndex = 1;
                    } else {
                        currentSectionIndex--;
                    }
                    showSection(currentSectionIndex);
                });
            });

            // submit everythng
            submitAllBtn.addEventListener('click', () => {
                confirmationDialog.classList.add('visible');
            });

            // confirma
            confirmYesBtn.addEventListener('click', async () => {
                submitAllBtn.innerHTML = '<span class="spinner"></span> Dispatching Pigeon...';
                submitAllBtn.disabled = true;
                
                try {
                    // firestore
                    await addDoc(collection(db, "royalResponses"), {
                        name: userName,
                        answers: answers,
                        timestamp: new Date()
                    });
                    
                    // thanku
                    currentSectionIndex = sections.length - 1;
                    showSection(currentSectionIndex);
                    
                    // pigeon
                    pigeon.style.opacity = '1';
                    pigeon.style.animation = 'fly 8s linear forwards';
                    
                   
                    for (let i = 0; i < 15; i++) {
                        createFeather();
                    }
                } catch (error) {
                    console.error("Error adding document: ", error);
                    alert('The royal pigeon encountered an error! Please try again.');
                    submitAllBtn.innerHTML = 'Seal With Royal Grace';
                    submitAllBtn.disabled = false;
                }
            });

            confirmNoBtn.addEventListener('click', () => {
                confirmationDialog.classList.remove('visible');
            });

            // feather?
            function createFeather() {
                const feather = document.createElement('div');
                feather.className = 'feather';
                feather.innerHTML = '🪶';
                feather.style.left = `${Math.random() * 100}%`;
                feather.style.top = '-50px';
                feather.style.animationDuration = `${5 + Math.random() * 10}s`;
                document.body.appendChild(feather);
                
             
                setTimeout(() => {
                    feather.remove();
                }, 15000);
            }

            // init 1st secn
            showSection(currentSectionIndex);
        });
