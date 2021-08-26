import { ViewComponent } from '../view.component.js';
import state from '../../util/state.js';
import router from '../../app.js';
import env from '../../util/env.js';

DashboardComponent.prototype = new ViewComponent('dashboard');
function DashboardComponent() {

    let welcomeUserElement;
    let tableBodyElement;
    let errorMessageElement;

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }

        let authUser = state.authUser;

        DashboardComponent.prototype.injectStylesheet();
        DashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('Dashboard-title');
            tableBodyElement = document.getElementById('class-table-body');
            errorMessageElement = document.getElementById('error-msg');


            AppendUsersClasses(authUser.id);



            if(authUser.faculty){

                welcomeUserElement.innerText = "Faculty Dashboard";



            } else {

                welcomeUserElement.innerText = "Student Dashboard";


            }
            
            window.history.pushState('dashboard', 'Dashboard', '/dashboard');

        });

    }

    async function AppendUsersClasses(id){

        console.log('appending the classes')
        
        let response = await fetch(`${env.apiUrl}/classes/?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.JWT
            },
        })

        let data = await response.json();

        if(response.status!=200)
            updateErrorMessage(data.message);
        else{
            
            for(c in data){
                let row = document.createElement('tr');
                let idCell = document.createElement('td');
                let titleCell = document.createElement('td');
                let professorCell = document.createElement('td');
                let descriptionCell = document.createElement('td');
                let capacityCell = document.createElement('td');
    
    
                // Append cells to the row
                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(titleCell);
                row.appendChild(professorCell);
                row.appendChild(descriptionCell);
                row.appendChild(capacityCell);

                document.getElementById('class-table-body').appendChild(row);

                
                idCell.innerText = c.id;
                titleCell.innerText = c.name;
                descriptionCell.innerText = c.description;
                capacityCell.innerText = c.capacity;

                let professors = c.faculty;
                for(p in professors)
                    professorCell.innerText += (p + "\n");
            }

        }

    }

    
    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

}

export default new DashboardComponent();
