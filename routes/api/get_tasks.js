const router = require('express').Router();
const axios = require('axios');

router.post('/tasks/get', (req, res, next) => {
    let {searchText, apiBaseUrl} = req.body;
    if (searchText && apiBaseUrl) {
        // axios.get(`${apiBaseUrl}/rest/api/2/issue/MVM-12582`,
        //     {
        //         fields: 'attachment',
        //         headers: {
        //             cookie: req.cookies.jsid,
        //             "Content-Type": "application/json"
        //         }
        //     }
        // ).then(r => {
        //     debugger
        //     res.send('ok')
        // }).catch(e => {
        //     debugger
        //     res.send('nok')
        // })
        axios.get(`${apiBaseUrl}/rest/api/2/search`,
           /* {
                jql: `text ~ "${searchText}" OR id = "${searchText}"`
            },*/
            {
                params: {
                    jql: `text ~ "${searchText}" OR id = "${searchText}"`,
                    fields: 'attachment, description, summary'
                },
                headers: {
                    cookie: req.cookies.jsid,
                    "Content-Type": "application/json"
                }
            }
        ).then(r => {
            console.log(r.data);
            res.status(200);
            let description = r.data.issues.map(item => generateDescription(item.fields.description).filter((issue) => issue.trim()));
            res.send(description);
        }).catch(e => {
            res.status(401);
            res.send({errors: ['Not Authorized']})
        })
    } else {
        res.status(401);
        res.json({errors: ['SearchText and apiBaseUrl required']});
    }
});



   function generateDescription(description) {
    // .replace(/(![^\s!]+!)/g, this.generatePictureLink.bind(this))
        return description.replace(/(\r\n)+(\r)+/g, '').split('\n');
    }

    function generatePictureLink(pic, links) {
        return pic.replace(/!/g, '');
    }

    function prapareDescription(description, attachments) {
        return description.map((text) => {
            if (text.match(/(![^\s!]+!)/g)) {
                return {
                    type: 'link',
                    value: generatePictureLink(text, attachments)
                }
            }
        })
    }


module.exports = router;