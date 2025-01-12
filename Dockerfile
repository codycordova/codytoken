FROM nginx:alpine

# Copy the stellar.toml file into the image
COPY ./.well-known/stellar.toml /usr/share/nginx/html/.well-known/stellar.toml

# Copy your HTML pages
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./purchase.html /usr/share/nginx/html/purchase.html
COPY ./terms.html /usr/share/nginx/html/terms.html

# Copy your CSS file into a css directory
COPY ./css/styles.css /usr/share/nginx/html/css/styles.css

# Make sure the css directory exists
RUN mkdir -p /usr/share/nginx/html/css

# Configure Nginx to serve the stellar.toml file with the correct content type and CORS headers
RUN echo $'server {\n\
    listen 8080;\n\
    root /usr/share/nginx/html;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ =404;\n\
    }\n\
    \n\
    location /.well-known/stellar.toml {\n\
        default_type text/plain;\n\
        add_header \'Access-Control-Allow-Origin\' \'*\';\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Start Nginx using the default command
