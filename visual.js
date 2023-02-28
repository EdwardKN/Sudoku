var table;

var grid = [];

function init(){
    table = document.createElement("table");

    document.body.appendChild(table);

    for(let y = 0; y < 9; y++){
        let tmpTr = document.createElement("tr");
        let tmpGrid = [];
        for(let x = 0; x < 9; x++){
            let tmpTd = document.createElement("td");
            let tmpSelect = document.createElement("select");
            tmpSelect.setAttribute("onchange","updateChanged("+y+","+x+")");

            for(let n = 0; n < 10; n++){
                let tmpOption = document.createElement("option");
                if(n !== 0){
                    tmpOption.value = n;
                    tmpOption.text = n;
                }else{
                    tmpOption.value = n;
                    tmpOption.text = "";
                }


                tmpSelect.appendChild(tmpOption);

            }
            tmpGrid.push({td:tmpTd,select:tmpSelect,possibleValues:[]});
            tmpTd.appendChild(tmpSelect)
            tmpTr.appendChild(tmpTd);
        }
        grid.push(tmpGrid)
        table.appendChild(tmpTr);
    }
}

function updateTable(){
    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            if(grid[y][x].value !== undefined){
                grid[y][x].select.value = grid[y][x].value;
            }
        }
    }
}

function updateChanged(x,y){
    grid[x][y].value = JSON.parse(grid[x][y].select.value);
}

init();


function setTestValues(){
    let tmpGrid = [
        [
            {
    
            },
            {
    
            },
            {
    
                "value": 1
            },
            {
    
                "value": 9
            },
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 3
            }
        ],
        [
            {
    
            },
            {
    
            },
            {
    
                "value": 8
            },
            {
    
            },
            {
    
                "value": 1
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 5
            },
            {
    
            }
        ],
        [
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 6
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 4
            }
        ],
        [
            {
    
                "value": 8
            },
            {
    
            },
            {
    
                "value": 6
            },
            {
    
                "value": 2
            },
            {
    
                "value": 5
            },
            {
    
                "value": 7
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 1
            }
        ],
        [
            {
    
                "value": 3
            },
            {
    
            },
            {
    
                "value": 7
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 8
            },
            {
    
            },
            {
    
            },
            {
    
            }
        ],
        [
            {
    
            },
            {
    
                "value": 2
            },
            {
    
            },
            {
    
                "value": 1
            },
            {
    
            },
            {
    
                "value": 3
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 9
            }
        ],
        [
            {
    
                "value": 2
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 6
            },
            {
    
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 3
            },
            {
    
                "value": 5
            }
        ],
        [
            {
    
            },
            {
    
            },
            {
    
                "value": 3
            },
            {
    
                "value": 8
            },
            {
    
                "value": 2
            },
            {
    
            },
            {
    
                "value": 4
            },
            {
    
            },
            {
    
                "value": 6
            }
        ],
        [
            {
    
            },
            {
    
                "value": 7
            },
            {
    
            },
            {
    
            },
            {
    
                "value": 3
            },
            {
    
                "value": 4
            },
            {
    
            },
            {
    
            },
            {
    
            }
        ]
    ]

    for(let y = 0; y < 9; y++){
        for(let x = 0; x < 9; x++){
            grid[y][x].value = a[y][x].value
        }
    }
    updateTable()
}