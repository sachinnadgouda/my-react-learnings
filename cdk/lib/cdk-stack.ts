import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

	// create dynamo table
    const table = new dynamodb.Table(this, 'Messages', {
      partitionKey: {
        name: 'app_id',
        type: dynamodb.AttributeType.STRING
      }, 
      sortKey: {
        name: 'created_at',
        type: dynamodb.AttributeType.NUMBER
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
	
	// create vpc
	const vpc = new ec2.Vpc(this, "my-react-learnings-cdk-vpc", {
      cidr: "10.1.0.0/16",
      maxAzs: 3 // Default is all AZs in region
    });
	
	// create ecr
	const repository = new ecr.Repository(this, "my-react-learnings-cdk-ecr-api", {
      repositoryName: "my-react-learnings"
    });
	
	// create ecs cluster
	const cluster = new ecs.Cluster(this, "my-react-learnings-cluster", {
      vpc: vpc
    });
	
	// create execution policy iam role
	const executionRolePolicy =  new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ]
    });

	// create task defination
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'my-react-learnings-task', {
      memoryLimitMiB: 512,
      cpu: 256,
    });
    fargateTaskDefinition.addToExecutionRolePolicy(executionRolePolicy);
    fargateTaskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [table.tableArn],
      actions: ['dynamodb:*']
    }));

	// create fargate container
    const container = fargateTaskDefinition.addContainer("my-react-container", {
      // Use an image from Amazon ECR
      image: ecs.ContainerImage.fromRegistry(repository.repositoryUri),
      environment: { 
        'DYNAMODB_MESSAGES_TABLE': table.tableName,
        'APP_ID' : 'my-react-learnings'
      }
      // ... other options here ...
    });

    container.addPortMappings({
      containerPort: 80
    });
	
	// create fargate service
	const sg_service = new ec2.SecurityGroup(this, 'my-react-service', { vpc: vpc });
    sg_service.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(80));

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: fargateTaskDefinition,
      desiredCount: 1,
      assignPublicIp: false,
      securityGroup: sg_service
    });

    // Setup AutoScaling policy
    //const scaling = service.autoScaleTaskCount({ maxCapacity: 2, minCapacity: 1 });
    //scaling.scaleOnCpuUtilization('CpuScaling', {
    //  targetUtilizationPercent: 90,
    //  scaleInCooldown: cdk.Duration.seconds(60),
    //  scaleOutCooldown: cdk.Duration.seconds(60)
    // });
	
	// create load balancer
	const lb = new elbv2.ApplicationLoadBalancer(this, 'my-react-learnings-alb', {
      vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [service],
      healthCheck: { path: '/' }
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');
  }
}
