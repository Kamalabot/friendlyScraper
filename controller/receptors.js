const {siteData,tableData,selectorsData,database} = require('../db/connect');

const loadLinks= (req,res) =>{
    const url = req.query.url;
    siteData.find({ url:url}, (err, docs)=>{
        if(err){
            throw err;
        }
        // console.log(docs[0]["links"])

        const {links} = docs[0]

        return res.status(200).json({success:true,links})
    })
}

const loadLists= (req,res) =>{
    const url = req.query.url;
    siteData.find({ url:url}, (err, docs)=>{
        if(err){
            throw err;
        }
        // console.log(docs[0]["links"])

        const {lists} = docs[0]

        return res.status(200).json({success:true,lists})
    })
}

const loadParas= (req,res) =>{
    const url = req.query.url;
    siteData.find({ url:url}, (err, docs)=>{
        if(err){
            throw err;
        }
        // console.log(docs[0]["links"])

        const {paras} = docs[0]

        return res.status(200).json({success:true,paras})
    })
}

const loadSpans= (req,res) =>{
    const url = req.query.url;
    siteData.find({ url:url}, (err, docs)=>{
        if(err){
            throw err;
        }
        // console.log(docs[0]["links"])

        const {spans} = docs[0]

        return res.status(200).json({success:true,spans})
    })
}

const loadTables= (req,res) =>{
    const url = req.query.url;
    tableData.find({ url:url}, (err, docs)=>{
        if(err){
            throw err;
        }
        // console.log(docs[0]["links"])

        const {bodies} = docs[0]

        return res.status(200).json({success:true,bodies})
    })
}

module.exports ={loadTables,loadSpans,loadParas,loadLists,loadLinks}