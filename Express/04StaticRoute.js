// There will be times that you need to provide static files to your clients; Images, PDFs, downloadable files are all great 
// examples. But the idea of static files doesn't end there. Non dynamic files such as CSS, HTML, and any other static file 
// needed can be hosted this way.


//here no path is specified in the first argument. So default / is taken
      app.use(express.static('public'));
      
//here /imagessss endpoint is specified.     
      app.use('/imagessss', express.static('./public/images'));

//note: use either './public/images' or 'public/images' but not '/public/images'
