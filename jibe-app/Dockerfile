FROM rabbitmq:management

RUN rabbitmq-plugins enable rabbitmq_shovel_management
RUN rabbitmq-plugins enable --offline rabbitmq_management_agent
RUN rabbitmq-plugins enable --offline rabbitmq_management

# Enable RabbitMQ Federation plugins
RUN rabbitmq-plugins enable --offline rabbitmq_federation
RUN rabbitmq-plugins enable --offline rabbitmq_federation_management

# Enable RabbitMQ to Kafka plugin
#   RUN rabbitmq-plugins enable --offline rabbitmq_to_kafka


