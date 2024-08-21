function removeStartLogging(self) {
    let node = document.getElementById("blockForLogging");
    const clone = node.cloneNode(true);
    node.remove();
    
    function removeTillEnd(self) {
        if (self.nextElementSibling != null && self.nextElementSibling.tagName != "SCRIPT") {
            let element = self.nextElementSibling;
            element.remove();
            removeTillEnd(self);
        } else {
            return;
        }

    }
    removeTillEnd(self);
    if (self.nextSibling != null) {
        let element = self.nextSibling;
        element.remove();
    }
    console.log("nextSibling = ", self.nextSibling);
    document.body.appendChild(clone);
    document.getElementById("blockForLogging").style.display = "block";
    
    operateWithLoggingElements();
    
}

async function operateWithLoggingElements() {
    let buttonLogging = document.getElementById("requestLogging");
    let data = document.querySelectorAll(".new-dates-logging");
    let idProject = document.getElementById("idProjectLogging");
    this.urlData = await requestApiForDataBase({"type": "db"});
    console.log("Данные из БД  = ", this.urlData);
    await createUrlOptions();
    
    async function createUrlOptions() {
        this.urlData.data.forEach((el, ind) => {
            let option = document.createElement("option");
            option.text = el.name;
            option.value = el.url_address;
            idProject.add(option);
        });
    }
    
    buttonLogging.onclick = function () {
        if (data[0].value != "" && idProject.value != "0") {
            console.log(data[0].value, idProject.options[idProject.selectedIndex].text);
            let projectName = idProject.options[idProject.selectedIndex].text;
            let projectValue = idProject.options[idProject.selectedIndex].value;
            let myDate = new Date(data[0].value);
            const convert = (dig) => (dig.length > 1) ? dig : "0" + dig;

            const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let myDateString = myDate.getFullYear().toString() +  convert(parseInt(myDate.getMonth()+1).toString()) + convert(myDate.getDate().toString());

            let dataToSend = {"type": "file", "date": myDateString, "project": projectName, "url": projectValue};

            requestApi(dataToSend);
        } else {
            document.getElementById("infoForLogging").innerHTML = "Данные не выбраны";
        }
    }
    
    async function requestApiForDataBase(dataToSend) {
        let myUrl = window.location.href.split('?')[0];
        let url = new URL(myUrl);
        url.pathname = "/apiForLogging";
        console.log(url.toString());
        const request = new Request(url, {
                                method: "POST",
                                headers: {
                                            'Content-Type': 'application/json;charset=utf-8',

                                        },
                                        body: JSON.stringify(dataToSend)
                                });
        const response = await fetch(request);    
        const data = await response.json();
        return data;
    }
    
    function requestApi(dataToSend) {
        let myUrl = window.location.href.split('?')[0];
        let url = new URL(myUrl);
        url.pathname = "/apiForLogging";
        console.log(url.toString());
        fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',

                    },
                    body: JSON.stringify(dataToSend)
                    })
                    .then(response => response.json())
                    .then(data => {
//                        console.log("Проверка false = ", data);
                        if (data.data !== "no data") {
                            txtArray = data.data.split("\n");
                            console.log(txtArray[0]);
                            console.log("Проверяем боди = ", data.test);
                            parseData(txtArray);
                            document.getElementById("infoForLogging").innerHTML = "";
                        } else {
                            document.getElementById("infoForLogging").innerHTML = "Данных нет";
                            if (document.getElementById("myTableLogging")) {
                                Array.from(["myTableLogging", "idAnketaLogging", "emailUserLogging"], x => document.getElementById("myTableLogging"))
                                        .forEach((el, ind) => {el.innerHTML = "";});
                            };
                        }

                    })
                    .then(() => {startAnalyse();});
    }
    
    function parseData(txtArray) {
        return new Promise ((resolve, reject) => {
            const elem = document.createElement('br');
            let dataList = document.getElementById("filterListLogging");
            if (dataList.options.length > 0) {dataList.innerHTML = "";}
            let anketaData = [];
            let emailData = [];
            let tableData = document.getElementById("myTableLogging");
            if (tableData == null) {
                tableData = document.createElement('table');
            }
            else {
                tableData.innerHTML = "";
            };
            tableData.id = "myTableLogging";
            txtArray.forEach((el, ind) => {
                let dataString = el.trim().split(" ");
                let rowData = tableData.insertRow(ind);
                let c = rowData.insertCell(0);
                c.innerHTML = el.trim();
                let pattern1 = /^\d+\:$/g;
                if (pattern1.test(dataString[0].trim())) {
                    anketaData.push(dataString[0].replace(":",""));
                    emailData.push(dataString[dataString.length-1]);
                };

            });
            anketaData.sort(function(a, b){return a - b});
            emailData.sort();

            const createSelect = (data, id) => {
                const elemSelect = document.getElementById(id);
                if (elemSelect.options.length > 0) {elemSelect.innerHTML = "";}
                let option = document.createElement("option");
                option.value = -1;
                option.text = (id == "idAnketaLogging") ? "Выберите ID": "Выберите email";
                elemSelect.add(option);
                Array(...new Set(data)).forEach((el, ind) => {
                    let option = document.createElement("option");
                    option.value = ind;
                    option.text = el;
                    elemSelect.add(option);
                });
            };
    //        document.body.appendChild(elem);
            createSelect(anketaData, "idAnketaLogging");
            createSelect(emailData, "emailUserLogging");
    //        document.body.appendChild(elem);
            document.body.appendChild(tableData);

            resolve();

        });
    }
    
    function startAnalyse() {
        let myTable = document.getElementById("myTableLogging");
        let idAnketaFilter = document.getElementById("idAnketaLogging");
        let emailUserFilter = document.getElementById("emailUserLogging");
        let buttonForList = document.getElementById("filterDataLogging");
        let dataList = document.getElementById("filterListLogging");
        let findDataList = document.getElementById("findDataLogging");
        let clearDataList = document.getElementById("cleanDataLogging");
        let dopText = document.getElementById("dop-Text");
        let addDopText = document.getElementById("insert-into-list");

        function findData() {
            let filter = this.options[this.selectedIndex].text;
            console.log(filter);
            let tr = myTable.getElementsByTagName("tr");
            Array.from(tr).forEach((elm, ind) => {
                let td = elm.getElementsByTagName("td");
                let txtValue = td[0].innerHTML;
                elm.style.display = (txtValue.includes(filter)) ? "block": "none";
            });
        }
        
        function findDataForList() {
            Array.from([idAnketaFilter, emailUserFilter]).forEach((el, index) => {
                let firstOption = (dataList.options.length > 0) ? dataList.options[0].text : null;
                if (el.selectedIndex != 0) {
                    if (firstOption !== null) {
                        if ([...el.options].map(o => o.text).indexOf(firstOption) == -1) {
                            return;
                        } else if ([...dataList.options].map(o => o.text).indexOf(el.options[el.selectedIndex].text) != -1) {
                            return;
                        }
                    }
                    console.log(el.selectedIndex);
                    let option = document.createElement("option");
                    option.text = el.options[el.selectedIndex].text;
                    dataList.insertBefore(option, dataList.firstChild);
                }
            });
        }

        buttonForList.onclick = findDataForList;
        
        addDopText.onclick = function() {
            let textToAdd = dopText.value.trim();
            if (textToAdd != null) {
                Array.from([idAnketaFilter, emailUserFilter]).forEach((el, index) => {
                    let firstOption = (dataList.options.length > 0) ? dataList.options[0].text : null;
                    if ([...el.options].map(o => o.text).indexOf(textToAdd) == -1) {
                        dopText.value = "";
                        return;
                    }
                    if ([...dataList.options].map(o => o.text).indexOf(textToAdd) != -1) {
                        dopText.value = "";
                        return;
                    }
                    if (firstOption !== null) {
                        if ([...el.options].map(o => o.text).indexOf(firstOption) == -1) {
                            dopText.value = "";
                            return;
                        }
                    }
                    let option = document.createElement("option");
                    option.text = textToAdd;
                    dataList.insertBefore(option, dataList.firstChild);
                    dopText.value = "";
                        
                });
            }
        };

        findDataList.onclick = () => {
            console.log("this analyse = ", this.urlData);
            let tr = myTable.getElementsByTagName("tr");

            Array.from(tr).forEach((elm, ind) => {
                let txtValue = elm.getElementsByTagName("td")[0].innerHTML;
                let flag = false;
                [...dataList.options].map(o => o.text).forEach((elTxt, index) => {
                    if (txtValue.includes(elTxt)) flag = true;
                });
                elm.style.display = (flag) ? "block": "none";
            });
        }

        clearDataList.onclick = () => {dataList.innerHTML = "";}

    //    idAnketaFilter.onchange = findData.bind(idAnketaFilter);
    //    emailUserFilter.onchange = findData.bind(emailUserFilter);



    }
}

