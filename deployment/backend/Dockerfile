FROM python:3.10 as base

#COPY ./deployment/apt/apt.conf /etc/apt/apt.conf
#COPY ./deployment/apt/reg.conf /etc/apt/auth.conf.d/reg.conf
#COPY ./deployment/apt/sources.list /etc/apt/sources.list

ENV USERNAME=app

RUN apt-get update && apt-get install -y --no-install-recommends \
    unixodbc-dev libaio1 unzip && \
    apt-get clean -y && \
    apt-get autoclean -y && \
    rm -rf /var/lib/apt/lists/* /var/lib/log/* /tmp/* /var/tmp/*
#    rm /etc/apt/auth.conf.d/reg.conf


FROM base as final

COPY ./components/backend/ /app
WORKDIR /app

RUN pip install -r requirements.txt

RUN groupadd -r $USERNAME && \
    useradd -r -g $USERNAME -d /home/$USERNAME -s /sbin/nologin -c "Docker image user" app

COPY --chown=app:app ./deployment/backend/entrypoint_*.sh /usr/local/bin/
COPY --chown=app:app ./.pgpass /app
COPY --chown=app:app ./.pg_service.conf /home/app/

RUN chmod 0600 /app/.pgpass
RUN chmod +x /usr/local/bin/entrypoint_*.sh

RUN mkdir -p /app/staticfiles
RUN chmod -R 777 /app/staticfiles


USER $USERNAME
