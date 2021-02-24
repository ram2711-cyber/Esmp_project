const express=require('express')
const app=express()
const port=3000

// const flash=require('flash')
const connection = require('./sqlconnect');


app.use(express.static('public'))
app.use('/css', express.static(__dirname+'public/css'))
app.use('/js', express.static(__dirname+'public/js'))
app.use('/images', express.static(__dirname+'public/images'))
// app.use(flash())

app.set('views','./views')
app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const timeInMilli=()=> {
    var date=new Date().getTime();
    return date;

}


app.get('/', (req,res)=>{
    connection.getConnection((err,tmpConnect)=>{
        if(err){
            tmpConnect.release();
            return res.send("Error")
        } 
        
        tmpConnect.query("SELECT * FROM vehicles",(err,rows,fields)=>{
            if(err){
                tmpConnect.release();
                return res.send("Error")
            } else{
                return res.render('index',{
                    rows: rows
                })
            }
        })
    })
})

app.post('/', (req, res)=>{
    let vehicleNo = req.body.vehicleNo;
    if(vehicleNo){
        let sqlQuery=`SELECT vehicle_no,out_time FROM vehicles WHERE vehicle_no='${vehicleNo}'`
        connection.getConnection((err,tmpConnect)=>{
            if(err){
                tmpConnect.release();
                return res.send("Error")
            }
            tmpConnect.query(sqlQuery, (err, rs)=>{
                if(err){
                    tmpConnect.release();
                    return res.send("Error")
                }

                if(rs.length>0){
                    if(rs[0].out_time>0){
                        return res.redirect("/")
                    } else{
                        let query1=`UPDATE vehicles SET out_time=${timeInMilli()} WHERE vehicle_no='${vehicleNo}'`
                        tmpConnect.query(query1, (err,rs)=>{
                            if(err){
                                tmpConnect.release();
                                return res.send("Error")
                            }
                            return res.redirect("/");
                        })
                    }
                    
                }
                else{    
                    let query1=`INSERT INTO vehicles (vehicle_no, in_time, amount, paid) VALUES('${vehicleNo}',${timeInMilli()},'${0}','${0}')`

                    tmpConnect.query(query1, (err,rs)=>{
                        if(err){
                            tmpConnect.release();
                            return res.send("Error")
                        }
                    return res.redirect("/");
                    })
                }

            })
        })
    }
})

app.listen(port,()=>{
    console.log(`server is running at port http://localhost:${port}`)
})

