switch(newValue.sub_plan) {
    case '1000':
        console.log('Tier 1 sub!');
        pointsCalc = 1;
        if (!(gifterName == '' || gifterName == null || gifterName == undefined)) {
            console.log('Gifted sub!');
            console.log('Gifter: ' + newValue.gifter);
            userlist = fs.readFileSync(path.resolve(__dirname, './userlist.json'));
            user = JSON.parse(userlist);
                console.log('Gifter display name: ' + newValue.gifter_display_name);
                console.log('Giftee: ' + newValue.name);
                if(user.hasOwnProperty(newValue.gifter.toLowerCase())) {
                    // Rounds the points down to the nearest integer.
                    actualPoints = Math.floor(pointsCalc*5);
                    initialPoints = user[newValue.gifter.toLowerCase()];
                    console.log('Gifter previous points: ' + initialPoints);
                    updatedPoints = actualPoints + initialPoints;
                    console.log('Gifter updated points: ' + updatedPoints);
                    user[newValue.gifter.toLowerCase()] = updatedPoints;

                    if(user.hasOwnProperty(newValue.name.toLowerCase())){
                        actualPoints = Math.floor(pointsCalc);
                        console.log('Giftee points set to: ' + actualPoints);
                        initialPoints = user[newValue.name.toLowerCase()];
                        console.log('Giftee previous points: ' + initialPoints);
                        updatedPoints = actualPoints + initialPoints;
                        console.log('Giftee updated points: ' + updatedPoints);
                        user[newValue.name.toLowerCase()] = updatedPoints;
                    }else {
                        user[newValue.name.toLowerCase()] = pointsCalc;
                    }

                    // Formats to human-readable when updating the json file.
                    data = JSON.stringify(user, null, 2);
                    fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
                } else {
                    user[newValue.gifter.toLowerCase()] = pointsCalc*5;
                    console.log('New gifter points: ' + pointsCalc*5);
                    // Formats to human-readable when updating the json file.
                    data = JSON.stringify(user, null, 2);
                    fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
                }
            } else {
                console.log('Not gifted');
                actualPoints = Math.floor(pointsCalc*5);
                user[newValue.name.toLowerCase()] = actualPoints;
                // Formats to human-readable when updating the json file.
                data = JSON.stringify(user, null, 2);
                fs.writeFileSync(path.resolve(__dirname, './userlist.json'), data);
                console.log('New subscriber points: ' + pointsCalc*5);
            }