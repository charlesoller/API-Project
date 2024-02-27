const formatDate = (data) => {
    if(data.length){
        for(let i = 0; i < data.length; i++){
            const obj = data[i].dataValues
            if(obj.createdAt){
                let date = obj.createdAt.toISOString().split(".")[0]
                date = date.split('T').join(" ")
                obj.createdAt = date
            }
            if(obj.updatedAt){
                let date = obj.updatedAt.toISOString().split(".")[0]
                date = date.split('T').join(" ")
                obj.updatedAt = date
            }
            if(obj.startDate){
                let date = obj.startDate.toISOString()
                date = date.split('T')[0]
                obj.startDate = date
            }
            if(obj.endDate){
                let date = obj.endDate.toISOString()
                date = date.split('T')[0]
                obj.endDate = date
            }
        }

        return data
    } else {
        if(!data.dataValues) return data;   // If it received an empty object, return directly
        const obj = data.dataValues
        if(obj.createdAt){
            let date = obj.createdAt.toISOString().split(".")[0]
            date = date.split('T').join(" ")
            obj.createdAt = date
        }
        if(obj.updatedAt){
            let date = obj.updatedAt.toISOString().split(".")[0]
            date = date.split('T').join(" ")
            obj.updatedAt = date
        }
        if(obj.startDate){
            let date = obj.startDate.toISOString()
            date = date.split('T')[0]
            obj.startDate = date
        }
        if(obj.endDate){
            let date = obj.endDate.toISOString()
            date = date.split('T')[0]
            obj.endDate = date
        }

        return data
    }

}

module.exports = { formatDate }
