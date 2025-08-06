// Firebase imports
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
        import { firebaseConfig } from './firebase-config1.js';

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        document.addEventListener('DOMContentLoaded', function() {
            // Get all sections
            const sections = Array.from(document.querySelectorAll('.section'));
            
            // DOM elements
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

            // Current section index
            let currentSectionIndex = 0;
            let userName = '';
            const answers = {};

            // Show current section and hide others
            function showSection(index) {
                sections.forEach((section, i) => {
                    if (i === index) {
                        section.classList.add('visible');
                        // Scroll to the section with some offset
                        setTimeout(() => {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    } else {
                        section.classList.remove('visible');
                    }
                });
            }

            // Name submission
            nameSubmitBtn.addEventListener('click', () => {
                if (nameInput.value.trim() === '') {
                    alert('Your royal title is required to proceed!');
                    return;
                }
                
                userName = nameInput.value.trim();
                personalGreeting.textContent = `My Dearest ${userName.split(' ')[0]}`;
                
                // Play background audio
                bgAudio.play().catch(e => console.log('Audio play failed:', e));
                
                // Move to welcome section
                currentSectionIndex = 1;
                showSection(currentSectionIndex);
            });

            // Welcome continue button
            welcomeContinueBtn.addEventListener('click', () => {
                currentSectionIndex = 2;
                showSection(currentSectionIndex);
            });

            // Next button functionality for all question sections
            document.querySelectorAll('.btn-submit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const currentSection = e.target.closest('.section');
                    const textarea = currentSection.querySelector('textarea');
                    const questionText = currentSection.querySelector('.question-text').textContent;
                    
                    if (textarea.value.trim() === '') {
                        alert('A royal response is required!');
                        return;
                    }
                    
                    // Save answer
                    answers[questionText] = textarea.value.trim();
                    
                    // Move to next section
                    currentSectionIndex++;
                    
                    // If we've reached the final section, enable submit button
                    if (currentSectionIndex === sections.length - 2) { // -2 because last is thank you
                        submitAllBtn.disabled = false;
                    }
                    
                    showSection(currentSectionIndex);
                });
            });

            // Previous button functionality
            document.querySelectorAll('.btn-back').forEach(button => {
                button.addEventListener('click', () => {
                    // Don't go back from first question to welcome
                    if (currentSectionIndex === 2) {
                        currentSectionIndex = 1;
                    } else {
                        currentSectionIndex--;
                    }
                    showSection(currentSectionIndex);
                });
            });

            // Submit all answers
            submitAllBtn.addEventListener('click', () => {
                confirmationDialog.classList.add('visible');
            });

            // Confirmation dialog buttons
            confirmYesBtn.addEventListener('click', async () => {
                submitAllBtn.innerHTML = '<span class="spinner"></span> Dispatching Pigeon...';
                submitAllBtn.disabled = true;
                
                try {
                    // Add document to Firestore
                    await addDoc(collection(db, "royalResponses"), {
                        name: userName,
                        answers: answers,
                        timestamp: new Date()
                    });
                    
                    // Show thank you section
                    currentSectionIndex = sections.length - 1;
                    showSection(currentSectionIndex);
                    
                    // Animate pigeon
                    pigeon.style.opacity = '1';
                    pigeon.style.animation = 'fly 8s linear forwards';
                    
                    // Create feathers
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

            // Create feather animation
            function createFeather() {
                const feather = document.createElement('div');
                feather.className = 'feather';
                feather.innerHTML = '🪶';
                feather.style.left = `${Math.random() * 100}%`;
                feather.style.top = '-50px';
                feather.style.animationDuration = `${5 + Math.random() * 10}s`;
                document.body.appendChild(feather);
                
                // Remove feather after animation
                setTimeout(() => {
                    feather.remove();
                }, 15000);
            }

            // Initialize first section
            showSection(currentSectionIndex);
        });
